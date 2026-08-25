using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Rsync.Delta;

namespace VRCNext.Services;

public class FilesAPI(VRChatApiService ctx)
{
    public async Task<string?> UploadImageAsync(byte[] imageBytes, string mimeType = "image/png", string ext = ".png")
    {
        if (!ctx.IsLoggedIn) return null;
        try
        {
            using var form = new MultipartFormDataContent();
            form.Add(new StringContent("gallery"), "tag");
            var fileContent = new ByteArrayContent(imageBytes);
            fileContent.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse(mimeType);
            form.Add(fileContent, "file", "image" + ext);

            ctx.Log($"UploadImage mimeType={mimeType} size={imageBytes.Length}");
            var resp = await ctx._http.PostAsync($"{VRChatApiService.BASE}/file/image", form);
            var body = await resp.Content.ReadAsStringAsync();
            ctx.Log($"UploadImage response: {(int)resp.StatusCode} preview={body[..Math.Min(200, body.Length)]}");
            if (!resp.IsSuccessStatusCode) return null;
            return JObject.Parse(body)["id"]?.ToString();
        }
        catch (Exception ex) { ctx.Log($"UploadImage exception: {ex.Message}"); return null; }
    }

    public async Task<JArray> GetInventoryFilesAsync(string tag, int n = 100, int offset = 0)
    {
        if (!ctx.IsLoggedIn) return new JArray();
        try
        {
            var url = $"{VRChatApiService.BASE}/files?tag={Uri.EscapeDataString(tag)}&n={n}&offset={offset}";
            ctx.Log($"GetInventoryFiles tag={tag} n={n} offset={offset}");
            var resp = await ctx._http.GetAsync(url);
            var body = await resp.Content.ReadAsStringAsync();
            ctx.Log($"GetInventoryFiles response: {(int)resp.StatusCode} len={body.Length}");
            if (resp.IsSuccessStatusCode) return JArray.Parse(body);
            ctx.Log($"GetInventoryFiles error: {body[..Math.Min(200, body.Length)]}");
        }
        catch (Exception ex) { ctx.Log($"GetInventoryFiles exception: {ex.Message}"); }
        return new JArray();
    }

    public async Task<(bool ok, JObject? file, string error)> UploadInventoryImageAsync(byte[] bytes, string tag, string animationStyle = "", string maskTag = "")
    {
        if (!ctx.IsLoggedIn) return (false, null, "Not logged in");
        try
        {
            using var form = new MultipartFormDataContent();
            form.Add(new StringContent(tag), "tag");
            if (!string.IsNullOrEmpty(animationStyle))
                form.Add(new StringContent(animationStyle), "animationStyle");
            if (!string.IsNullOrEmpty(maskTag))
                form.Add(new StringContent(maskTag), "maskTag");
            var fileContent = new ByteArrayContent(bytes);
            fileContent.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse("image/png");
            form.Add(fileContent, "file", "upload.png");

            ctx.Log($"UploadInventoryImage tag={tag} size={bytes.Length}");
            var resp = await ctx._http.PostAsync($"{VRChatApiService.BASE}/file/image", form);
            var body = await resp.Content.ReadAsStringAsync();
            ctx.Log($"UploadInventoryImage response: {(int)resp.StatusCode} preview={body[..Math.Min(200, body.Length)]}");
            if (resp.IsSuccessStatusCode) return (true, JObject.Parse(body), "");
            var errMsg = VRChatApiService.TryGetApiError(body) ?? $"HTTP {(int)resp.StatusCode}";
            return (false, null, errMsg);
        }
        catch (Exception ex) { ctx.Log($"UploadInventoryImage exception: {ex.Message}"); return (false, null, ex.Message); }
    }

    public async Task<JObject?> GetFileAsync(string fileId)
    {
        if (!ctx.IsLoggedIn || string.IsNullOrEmpty(fileId)) return null;
        try
        {
            var resp = await ctx._http.GetAsync($"{VRChatApiService.BASE}/file/{fileId}");
            if (!resp.IsSuccessStatusCode) return null;
            return JObject.Parse(await resp.Content.ReadAsStringAsync());
        }
        catch { return null; }
    }

    public async Task<bool> DeleteInventoryFileAsync(string fileId)
    {
        if (!ctx.IsLoggedIn) return false;
        try
        {
            var resp = await ctx._http.DeleteAsync($"{VRChatApiService.BASE}/file/{fileId}");
            var body = await resp.Content.ReadAsStringAsync();
            ctx.Log($"DeleteInventoryFile {fileId}: {(int)resp.StatusCode} body={body[..Math.Min(300, body.Length)]}");
            return resp.IsSuccessStatusCode;
        }
        catch (Exception ex) { ctx.Log($"DeleteInventoryFile exception: {ex.Message}"); return false; }
    }

    public static async Task<(bool ok, string imageUrl, string error)> ReplaceEntityImageAsync(
        VRChatApiService ctx, string entityPath, string entityId, string existingImageUrl, byte[] imageBytes)
    {
        if (!ctx.IsLoggedIn) return (false, "", "Not logged in");
        try
        {
            var match = System.Text.RegularExpressions.Regex.Match(existingImageUrl, @"/file/([^/]+)/\d+");
            if (!match.Success) return (false, "", "Could not extract file ID from existing image URL");
            var sourceFileId = match.Groups[1].Value;

            using var md5 = MD5.Create();
            var fileMd5 = Convert.ToBase64String(md5.ComputeHash(imageBytes));
            var fileSizeInBytes = imageBytes.Length;

            var signatureBytes = await ComputeRsyncSignatureAsync(imageBytes);
            var signatureMd5 = Convert.ToBase64String(md5.ComputeHash(signatureBytes));
            var signatureSizeInBytes = signatureBytes.Length;

            var initBody = JsonConvert.SerializeObject(new { fileMd5, fileSizeInBytes, signatureMd5, signatureSizeInBytes });
            ctx.Log($"ReplaceEntityImage[{entityPath}]: POST file/{sourceFileId} fileSize={fileSizeInBytes} sigSize={signatureSizeInBytes}");
            var r = await ctx._http.PostAsync(
                $"{VRChatApiService.BASE}/file/{sourceFileId}",
                new StringContent(initBody, Encoding.UTF8, "application/json"));
            var rb = await r.Content.ReadAsStringAsync();
            ctx.Log($"ReplaceEntityImage[{entityPath}]: init [{(int)r.StatusCode}] preview={rb[..Math.Min(200, rb.Length)]}");
            if (!r.IsSuccessStatusCode) return (false, "", VRChatApiService.TryGetApiError(rb) ?? $"HTTP {(int)r.StatusCode}");

            var uploadObj = JObject.Parse(rb);
            var uploadedFileId = uploadObj["id"]?.ToString();
            var versions = uploadObj["versions"] as JArray;
            var fileVersion = versions?.OfType<JObject>().LastOrDefault()?["version"]?.Value<int>();
            if (string.IsNullOrEmpty(uploadedFileId) || fileVersion == null)
                return (false, "", "No file version returned");

            await UploadFileSegmentAsync(ctx, uploadedFileId, fileVersion.Value, "file", imageBytes, "image/png", fileMd5);
            await UploadFileSegmentAsync(ctx, uploadedFileId, fileVersion.Value, "signature", signatureBytes, "application/x-rsync-signature", signatureMd5);

            var newImageUrl = $"{VRChatApiService.BASE}/file/{uploadedFileId}/{fileVersion}/file";
            var entityBody = JsonConvert.SerializeObject(new { id = entityId, imageUrl = newImageUrl });
            ctx.Log($"ReplaceEntityImage[{entityPath}]: PUT {entityPath}/{entityId}");
            var ar = await ctx._http.PutAsync(
                $"{VRChatApiService.BASE}/{entityPath}/{entityId}",
                new StringContent(entityBody, Encoding.UTF8, "application/json"));
            var arb = await ar.Content.ReadAsStringAsync();
            ctx.Log($"ReplaceEntityImage[{entityPath}]: PUT [{(int)ar.StatusCode}] preview={arb[..Math.Min(200, arb.Length)]}");
            if (!ar.IsSuccessStatusCode) return (false, "", VRChatApiService.TryGetApiError(arb) ?? $"HTTP {(int)ar.StatusCode}");
            return (true, newImageUrl, "");
        }
        catch (Exception ex) { ctx.Log($"ReplaceEntityImage[{entityPath}] exception: {ex.Message}"); return (false, "", ex.Message); }
    }

    private static async Task UploadFileSegmentAsync(VRChatApiService ctx, string fileId, int version, string segment, byte[] data, string mimeType, string md5Base64)
    {
        var startUrl = $"{VRChatApiService.BASE}/file/{fileId}/{version}/{segment}/start";
        ctx.Log($"UploadFileSegment [{segment}]: PUT start");
        var startResp = await ctx._http.PutAsync(startUrl, new StringContent("{}", Encoding.UTF8, "application/json"));
        var startBody = await startResp.Content.ReadAsStringAsync();
        ctx.Log($"UploadFileSegment [{segment}]: start [{(int)startResp.StatusCode}] preview={startBody[..Math.Min(200, startBody.Length)]}");
        var uploadUrl = JObject.Parse(startBody)["url"]?.ToString();

        if (!string.IsNullOrEmpty(uploadUrl))
        {
            ctx.Log($"UploadFileSegment [{segment}]: PUT to CDN");
            var fileContent = new ByteArrayContent(data);
            fileContent.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse(mimeType);
            // VRChat internal upload URLs require auth cookies; S3 URLs do not
            System.Net.Http.HttpResponseMessage cdnResp;
            if (uploadUrl.StartsWith(VRChatApiService.BASE, StringComparison.OrdinalIgnoreCase))
            {
                cdnResp = await ctx._http.PutAsync(uploadUrl, fileContent);
            }
            else
            {
                fileContent.Headers.Add("Content-MD5", md5Base64);
                using var s3Client = new HttpClient();
                s3Client.DefaultRequestVersion = System.Net.HttpVersion.Version20;
                s3Client.DefaultVersionPolicy = System.Net.Http.HttpVersionPolicy.RequestVersionOrLower;
                s3Client.Timeout = TimeSpan.FromSeconds(120);
                cdnResp = await s3Client.PutAsync(uploadUrl, fileContent);
            }
            ctx.Log($"UploadFileSegment [{segment}]: CDN [{(int)cdnResp.StatusCode}]");
        }

        var finishUrl = $"{VRChatApiService.BASE}/file/{fileId}/{version}/{segment}/finish";
        var finishBody = JsonConvert.SerializeObject(new { maxParts = 0, nextPartNumber = 0 });
        ctx.Log($"UploadFileSegment [{segment}]: PUT finish");
        var finishResp = await ctx._http.PutAsync(finishUrl, new StringContent(finishBody, Encoding.UTF8, "application/json"));
        ctx.Log($"UploadFileSegment [{segment}]: finish [{(int)finishResp.StatusCode}]");
    }

    private static async Task<byte[]> ComputeRsyncSignatureAsync(byte[] bytes)
    {
        var rdiff = new Rdiff();
        using var inputStream = new MemoryStream(bytes);
        using var outputStream = new MemoryStream();
        var options = new SignatureOptions(
            blockLength: 2048,
            strongHashLength: 8,
            rollingHashAlgorithm: RollingHashAlgorithm.Adler,
            strongHashAlgorithm: StrongHashAlgorithm.Blake2b);
        await rdiff.SignatureAsync(inputStream, outputStream, options);
        return outputStream.ToArray();
    }
}
