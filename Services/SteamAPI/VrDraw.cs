#if WINDOWS
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Numerics;
using System.Runtime.InteropServices;
using Vortice;
using Vortice.Direct3D11;
using Vortice.DXGI;
using Vortice.Mathematics;
using D2D = Vortice.Direct2D1;
using DW = Vortice.DirectWrite;
using WICN = Vortice.WIC;
using VSize = Vortice.Mathematics.Size;
using SDColor = System.Drawing.Color;
using SDPoint = System.Drawing.Point;
using SDPointF = System.Drawing.PointF;
using SDRect = System.Drawing.Rectangle;
using SDRectF = System.Drawing.RectangleF;
using SDSizeF = System.Drawing.SizeF;

namespace VRCNext.Services.VrDraw
{
    public enum FontStyle { Regular = 0, Bold = 1 }
    public enum GraphicsUnit { Pixel = 2, Point = 3 }
    public enum StringAlignment { Near = 0, Center = 1, Far = 2 }
    public enum StringTrimming { None = 0, EllipsisCharacter = 1, EllipsisWord = 2 }
    [Flags] public enum StringFormatFlags { NoWrap = 0x1000 }
    public enum CombineMode { Replace = 0, Intersect = 1 }
    public enum SmoothingMode { None = 0, AntiAlias = 1 }
    public enum TextRenderingHint { AntiAlias = 0, ClearTypeGridFit = 1 }
    public enum InterpolationMode { NearestNeighbor = 0, Bilinear = 1, HighQualityBilinear = 2, HighQualityBicubic = 3 }
    public enum PixelOffsetMode { None = 0, Half = 1, HighQuality = 2 }

    public sealed class FontFamily
    {
        public string Name { get; }
        internal DW.IDWriteFontCollection Collection { get; }
        internal FontFamily(string name, DW.IDWriteFontCollection collection)
        {
            Name = name;
            Collection = collection;
        }
    }

    public sealed class Font : IDisposable
    {
        public string FamilyName { get; }
        public FontFamily? Custom { get; }
        public float SizeDip { get; }
        public bool Bold { get; }

        public Font(string family, float size, FontStyle style, GraphicsUnit unit = GraphicsUnit.Point)
        {
            FamilyName = family;
            SizeDip = unit == GraphicsUnit.Pixel ? size : size * 96f / 72f;
            Bold = (style & FontStyle.Bold) != 0;
        }

        public Font(FontFamily family, float size, FontStyle style, GraphicsUnit unit = GraphicsUnit.Point)
            : this(family.Name, size, style, unit)
        {
            Custom = family;
        }

        public void Dispose() { }
    }

    public sealed class StringFormat : IDisposable
    {
        public StringAlignment Alignment { get; set; } = StringAlignment.Near;
        public StringAlignment LineAlignment { get; set; } = StringAlignment.Near;
        public StringTrimming Trimming { get; set; } = StringTrimming.None;
        public StringFormatFlags FormatFlags { get; set; } = 0;
        public bool Typographic { get; set; }

        public StringFormat() { }
        public StringFormat(StringFormat src)
        {
            Alignment = src.Alignment;
            LineAlignment = src.LineAlignment;
            Trimming = src.Trimming;
            FormatFlags = src.FormatFlags;
            Typographic = src.Typographic;
        }

        public static StringFormat GenericTypographic => new() { Typographic = true };
        public void Dispose() { }
    }

    public abstract class Brush : IDisposable
    {
        public abstract void Dispose();
    }

    public sealed class SolidBrush : Brush
    {
        public SDColor Color { get; set; }
        public SolidBrush(SDColor color) => Color = color;
        public override void Dispose() { }
    }

    public sealed class LinearGradientBrush : Brush
    {
        private readonly SDPointF _p1, _p2;
        private readonly SDColor _c1, _c2;
        private D2D.ID2D1LinearGradientBrush? _brush;
        private D2D.ID2D1GradientStopCollection? _stops;

        public LinearGradientBrush(SDPoint p1, SDPoint p2, SDColor c1, SDColor c2)
        {
            _p1 = p1; _p2 = p2; _c1 = c1; _c2 = c2;
        }

        internal D2D.ID2D1Brush GetD2D(D2D.ID2D1DeviceContext dc)
        {
            if (_brush != null) return _brush;
            var stops = new D2D.GradientStop[]
            {
                new() { Position = 0f, Color = D2DRenderer.ToColor4(_c1) },
                new() { Position = 1f, Color = D2DRenderer.ToColor4(_c2) },
            };
            _stops = dc.CreateGradientStopCollection(stops, D2D.Gamma.StandardRgb, D2D.ExtendMode.Clamp);
            _brush = dc.CreateLinearGradientBrush(
                new D2D.LinearGradientBrushProperties(new Vector2(_p1.X, _p1.Y), new Vector2(_p2.X, _p2.Y)),
                _stops);
            return _brush;
        }

        public override void Dispose()
        {
            _brush?.Dispose(); _brush = null;
            _stops?.Dispose(); _stops = null;
        }
    }

    public sealed class Pen : IDisposable
    {
        public SDColor Color { get; set; }
        public float Width { get; set; }
        public Pen(SDColor color, float width = 1f) { Color = color; Width = width; }
        public void Dispose() { }
    }

    public sealed class GraphicsPath : IDisposable
    {
        private abstract record Op;
        private sealed record ArcOp(float X, float Y, float W, float H, float Start, float Sweep) : Op;
        private sealed record EllipseOp(float X, float Y, float W, float H) : Op;
        private sealed record CloseOp : Op;

        private readonly List<Op> _ops = new();
        private D2D.ID2D1Geometry? _geo;

        public void AddArc(float x, float y, float w, float h, float startAngle, float sweepAngle)
        {
            _ops.Add(new ArcOp(x, y, w, h, startAngle, sweepAngle));
            Invalidate();
        }

        public void AddEllipse(float x, float y, float w, float h)
        {
            _ops.Add(new EllipseOp(x, y, w, h));
            Invalidate();
        }

        public void CloseFigure()
        {
            _ops.Add(new CloseOp());
            Invalidate();
        }

        private void Invalidate() { _geo?.Dispose(); _geo = null; }

        private static Vector2 PtOnArc(float cx, float cy, float rx, float ry, float deg)
        {
            float rad = deg * MathF.PI / 180f;
            return new Vector2(cx + rx * MathF.Cos(rad), cy + ry * MathF.Sin(rad));
        }

        internal D2D.ID2D1Geometry GetGeometry(D2D.ID2D1Factory1 factory)
        {
            if (_geo != null) return _geo;

            if (_ops.Count == 1 && _ops[0] is EllipseOp only)
            {
                _geo = factory.CreateEllipseGeometry(new D2D.Ellipse(
                    new Vector2(only.X + only.W / 2f, only.Y + only.H / 2f), only.W / 2f, only.H / 2f));
                return _geo;
            }

            var pg = factory.CreatePathGeometry();
            using (var sink = pg.Open())
            {
                bool open = false;
                foreach (var op in _ops)
                {
                    switch (op)
                    {
                        case ArcOp a:
                        {
                            float rx = a.W / 2f, ry = a.H / 2f;
                            float cx = a.X + rx, cy = a.Y + ry;
                            var p0 = PtOnArc(cx, cy, rx, ry, a.Start);
                            var p1 = PtOnArc(cx, cy, rx, ry, a.Start + a.Sweep);
                            if (!open) { sink.BeginFigure(p0, D2D.FigureBegin.Filled); open = true; }
                            else sink.AddLine(p0);
                            sink.AddArc(new D2D.ArcSegment(p1, new VSize(rx, ry), 0f,
                                a.Sweep >= 0f ? D2D.SweepDirection.Clockwise : D2D.SweepDirection.CounterClockwise,
                                MathF.Abs(a.Sweep) > 180f ? D2D.ArcSize.Large : D2D.ArcSize.Small));
                            break;
                        }
                        case EllipseOp e:
                        {
                            if (open) { sink.EndFigure(D2D.FigureEnd.Closed); open = false; }
                            float rx = e.W / 2f, ry = e.H / 2f;
                            float cx = e.X + rx, cy = e.Y + ry;
                            sink.BeginFigure(new Vector2(cx + rx, cy), D2D.FigureBegin.Filled);
                            sink.AddArc(new D2D.ArcSegment(new Vector2(cx - rx, cy), new VSize(rx, ry), 0f,
                                D2D.SweepDirection.Clockwise, D2D.ArcSize.Small));
                            sink.AddArc(new D2D.ArcSegment(new Vector2(cx + rx, cy), new VSize(rx, ry), 0f,
                                D2D.SweepDirection.Clockwise, D2D.ArcSize.Small));
                            sink.EndFigure(D2D.FigureEnd.Closed);
                            break;
                        }
                        case CloseOp:
                            if (open) { sink.EndFigure(D2D.FigureEnd.Closed); open = false; }
                            break;
                    }
                }
                if (open) sink.EndFigure(D2D.FigureEnd.Closed);
                sink.Close();
            }
            _geo = pg;
            return _geo;
        }

        public void Dispose() => Invalidate();
    }

    public sealed class ClipRegion : IDisposable
    {
        internal int Depth { get; }
        internal ClipRegion(int depth) => Depth = depth;
        public void Dispose() { }
    }

    public sealed class GraphicsState
    {
        internal int ClipDepth { get; }
        internal Matrix3x2 Transform { get; }
        internal GraphicsState(int clipDepth, Matrix3x2 transform)
        {
            ClipDepth = clipDepth;
            Transform = transform;
        }
    }

    public sealed class VrBitmap : IDisposable
    {
        public int Width { get; }
        public int Height { get; }

        private byte[]? _pixels;
        private D2D.ID2D1Bitmap? _gpu;
        private D2DRenderer? _owner;
        private int _gpuGen;
        private D2D.ID2D1Bitmap? _tiny;
        private int _tinyW, _tinyH, _tinyGen;
        private volatile bool _disposed;

        private VrBitmap(int w, int h, byte[] pixels)
        {
            Width = w;
            Height = h;
            _pixels = pixels;
        }

        internal D2D.ID2D1Bitmap? GetGpu(D2DRenderer r)
        {
            if (_disposed) return null;
            var px = _pixels;
            if (px == null) return null;
            if (_gpu != null && ReferenceEquals(_owner, r) && _gpuGen == r.Generation) return _gpu;
            ReleaseGpu();
            try
            {
                _gpu = r.CreateCpuBitmap(Width, Height, px);
                _owner = r;
                _gpuGen = r.Generation;
            }
            catch { _gpu = null; }
            return _gpu;
        }

        internal D2D.ID2D1Bitmap? GetTiny(D2DRenderer r, int w, int h)
        {
            int bw = w * 4, bh = h * 4;
            if (_disposed) return null;
            if (_tiny != null && ReferenceEquals(_owner, r) && _tinyGen == r.Generation && _tinyW == bw && _tinyH == bh)
                return _tiny;
            var gpu = GetGpu(r);
            if (gpu == null) return null;
            if (_tiny != null) { _owner?.EnqueueRelease(_tiny); _tiny = null; }
            D2D.ID2D1Bitmap1? intermediate = null;
            try
            {
                var offDC = r.OffscreenDC;

                void RenderStep(D2D.ID2D1Bitmap src, D2D.ID2D1Bitmap1 dst, int dw, int dh)
                {
                    offDC.Target = dst;
                    offDC.BeginDraw();
                    offDC.Clear(new Color4(0f, 0f, 0f, 0f));
                    offDC.DrawBitmap(src, new RawRectF(0, 0, dw, dh), 1f,
                        D2D.InterpolationMode.Linear, null, null);
                    offDC.EndDraw();
                    offDC.Target = null;
                }

                D2D.ID2D1Bitmap src = gpu;
                int curW = Width, curH = Height;
                while (curW > bw * 2 || curH > bh * 2)
                {
                    int nextW = Math.Max(bw, curW / 2);
                    int nextH = Math.Max(bh, curH / 2);
                    var step = r.CreateOffscreenTarget(nextW, nextH);
                    RenderStep(src, step, nextW, nextH);
                    intermediate?.Dispose();
                    intermediate = step;
                    src = step;
                    curW = nextW; curH = nextH;
                }
                var scaled = r.CreateOffscreenTarget(bw, bh);
                RenderStep(src, scaled, bw, bh);
                intermediate?.Dispose();
                intermediate = scaled;

                var target = r.CreateOffscreenTarget(bw, bh);
                using (var blur = new Vortice.Direct2D1.Effects.GaussianBlur(offDC))
                {
                    blur.SetInput(0, scaled, true);
                    blur.StandardDeviation = 6f;
                    blur.BorderMode = D2D.BorderMode.Hard;
                    offDC.Target = target;
                    offDC.BeginDraw();
                    offDC.Clear(new Color4(0f, 0f, 0f, 0f));
                    offDC.DrawImage(blur.Output, null, null,
                        D2D.InterpolationMode.Linear, D2D.CompositeMode.SourceOver);
                    offDC.EndDraw();
                    offDC.Target = null;
                }
                intermediate?.Dispose(); intermediate = null;

                _tiny = target;
                _tinyW = bw; _tinyH = bh; _tinyGen = r.Generation;
            }
            catch (Exception ex)
            {
                try { r.OffscreenDC.Target = null; } catch { }
                intermediate?.Dispose();
                r.Log?.Invoke($"[VrDraw] GetTiny failed: {ex.Message}");
                _tiny = null;
            }
            return _tiny;
        }

        private void ReleaseGpu()
        {
            if (_gpu != null) { _owner?.EnqueueRelease(_gpu); _gpu = null; }
            if (_tiny != null) { _owner?.EnqueueRelease(_tiny); _tiny = null; }
        }

        public void Dispose()
        {
            if (_disposed) return;
            _disposed = true;
            ReleaseGpu();
            _pixels = null;
        }

        public static VrBitmap? FromFile(string path)
        {
            try { return FromBytes(System.IO.File.ReadAllBytes(path)); }
            catch { return null; }
        }

        public static unsafe VrBitmap? FromBytes(byte[]? data)
        {
            if (data == null || data.Length == 0) return null;
            try
            {
                using var wic = new WICN.IWICImagingFactory();
                using var stream = wic.CreateStream(data);
                using var decoder = wic.CreateDecoderFromStream(stream, WICN.DecodeOptions.CacheOnDemand);
                using var frame = decoder.GetFrame(0);
                using var conv = wic.CreateFormatConverter();
                conv.Initialize(frame, WICN.PixelFormat.Format32bppPBGRA, WICN.BitmapDitherType.None, null, 0.0, WICN.BitmapPaletteType.MedianCut);
                var size = conv.Size;
                int w = size.Width, h = size.Height;
                if (w <= 0 || h <= 0) return null;
                var pixels = new byte[w * h * 4];
                fixed (byte* p = pixels)
                {
                    conv.CopyPixels(new RectI(0, 0, w, h), (uint)(w * 4), (uint)pixels.Length, (nint)p);
                }
                return new VrBitmap(w, h, pixels);
            }
            catch { return null; }
        }
    }

    public sealed class D2DRenderer : IDisposable
    {
        internal D2D.ID2D1Factory1 Factory { get; }
        private readonly D2D.ID2D1Device _device;
        internal D2D.ID2D1DeviceContext DC { get; }
        private D2D.ID2D1DeviceContext? _offDC;
        internal int Generation { get; } = 1;
        public Action<string>? Log { get; set; }

        private D2D.ID2D1SolidColorBrush? _solid;
        private readonly ConcurrentQueue<IDisposable> _releases = new();
        private volatile bool _disposed;

        public D2DRenderer(ID3D11Device d3dDevice)
        {
            Factory = D2D.D2D1.D2D1CreateFactory<D2D.ID2D1Factory1>(D2D.FactoryType.SingleThreaded, D2D.DebugLevel.None);
            using var dxgiDevice = d3dDevice.QueryInterface<IDXGIDevice>();
            _device = Factory.CreateDevice(dxgiDevice);
            DC = _device.CreateDeviceContext(D2D.DeviceContextOptions.None);
        }

        public D2D.ID2D1Bitmap1 CreateTargetBitmap(ID3D11Texture2D texture)
        {
            using var surface = texture.QueryInterface<IDXGISurface>();
            var props = new D2D.BitmapProperties1(
                new Vortice.DCommon.PixelFormat(Format.B8G8R8A8_UNorm, Vortice.DCommon.AlphaMode.Premultiplied),
                96f, 96f, D2D.BitmapOptions.Target | D2D.BitmapOptions.CannotDraw);
            return DC.CreateBitmapFromDxgiSurface(surface, props);
        }

        public D2DGraphics CreateGraphics(D2D.ID2D1Bitmap1 target)
        {
            DrainReleases();
            return new D2DGraphics(this, target);
        }

        internal D2D.ID2D1SolidColorBrush GetSolid(SDColor color)
        {
            _solid ??= DC.CreateSolidColorBrush(new Color4(0f, 0f, 0f, 0f));
            _solid.Color = ToColor4(color);
            return _solid;
        }

        internal D2D.ID2D1DeviceContext OffscreenDC
            => _offDC ??= _device.CreateDeviceContext(D2D.DeviceContextOptions.None);

        internal D2D.ID2D1Bitmap1 CreateOffscreenTarget(int w, int h)
        {
            var props = new D2D.BitmapProperties1(
                new Vortice.DCommon.PixelFormat(Format.B8G8R8A8_UNorm, Vortice.DCommon.AlphaMode.Premultiplied),
                96f, 96f, D2D.BitmapOptions.Target);
            return OffscreenDC.CreateBitmap(new SizeI(w, h), IntPtr.Zero, 0, props);
        }

        internal D2D.ID2D1Bitmap CreateCpuBitmap(int w, int h, byte[] premulBgra)
        {
            var handle = GCHandle.Alloc(premulBgra, GCHandleType.Pinned);
            try
            {
                var props = new D2D.BitmapProperties1(
                    new Vortice.DCommon.PixelFormat(Format.B8G8R8A8_UNorm, Vortice.DCommon.AlphaMode.Premultiplied),
                    96f, 96f, D2D.BitmapOptions.None);
                return DC.CreateBitmap(new SizeI(w, h), handle.AddrOfPinnedObject(), (uint)(w * 4), props);
            }
            finally { handle.Free(); }
        }

        internal void EnqueueRelease(IDisposable obj)
        {
            if (_disposed) { try { obj.Dispose(); } catch { } return; }
            _releases.Enqueue(obj);
        }

        internal void DrainReleases()
        {
            while (_releases.TryDequeue(out var obj))
            {
                try { obj.Dispose(); } catch { }
            }
        }

        internal static Color4 ToColor4(SDColor c) => new(c.R / 255f, c.G / 255f, c.B / 255f, c.A / 255f);

        public void Dispose()
        {
            if (_disposed) return;
            _disposed = true;
            DrainReleases();
            _solid?.Dispose(); _solid = null;
            _offDC?.Dispose(); _offDC = null;
            DC.Dispose();
            _device.Dispose();
            Factory.Dispose();
        }

        private static DW.IDWriteFactory? s_dwrite;
        private static readonly object s_lock = new();

        internal static DW.IDWriteFactory DWriteFactory
        {
            get
            {
                if (s_dwrite == null)
                {
                    lock (s_lock)
                    {
                        s_dwrite ??= DW.DWrite.DWriteCreateFactory<DW.IDWriteFactory>(DW.FactoryType.Shared);
                    }
                }
                return s_dwrite;
            }
        }

        private readonly record struct TextFormatKey(
            FontFamily? Custom, string Family, float Size, bool Bold,
            StringAlignment Align, StringAlignment LineAlign, StringTrimming Trim, bool NoWrap);

        private static readonly Dictionary<TextFormatKey, DW.IDWriteTextFormat> s_formats = new();

        internal static DW.IDWriteTextFormat GetTextFormat(Font font, StringFormat? sf)
        {
            var key = new TextFormatKey(
                font.Custom, font.FamilyName, font.SizeDip, font.Bold,
                sf?.Alignment ?? StringAlignment.Near,
                sf?.LineAlignment ?? StringAlignment.Near,
                sf?.Trimming ?? StringTrimming.None,
                ((sf?.FormatFlags ?? 0) & StringFormatFlags.NoWrap) != 0);

            lock (s_lock)
            {
                if (s_formats.TryGetValue(key, out var cached)) return cached;

                var fmt = DWriteFactory.CreateTextFormat(
                    key.Family, key.Custom?.Collection,
                    key.Bold ? DW.FontWeight.Bold : DW.FontWeight.Normal,
                    DW.FontStyle.Normal, DW.FontStretch.Normal, key.Size, "en-us");

                fmt.TextAlignment = key.Align switch
                {
                    StringAlignment.Center => DW.TextAlignment.Center,
                    StringAlignment.Far => DW.TextAlignment.Trailing,
                    _ => DW.TextAlignment.Leading,
                };
                fmt.ParagraphAlignment = key.LineAlign switch
                {
                    StringAlignment.Center => DW.ParagraphAlignment.Center,
                    StringAlignment.Far => DW.ParagraphAlignment.Far,
                    _ => DW.ParagraphAlignment.Near,
                };
                fmt.WordWrapping = key.NoWrap ? DW.WordWrapping.NoWrap : DW.WordWrapping.Wrap;

                if (key.Trim != StringTrimming.None)
                {
                    using var sign = DWriteFactory.CreateEllipsisTrimmingSign(fmt);
                    fmt.SetTrimming(new DW.Trimming
                    {
                        Granularity = key.Trim == StringTrimming.EllipsisCharacter
                            ? DW.TrimmingGranularity.Character
                            : DW.TrimmingGranularity.Word,
                    }, sign);
                }

                s_formats[key] = fmt;
                return fmt;
            }
        }

        public static FontFamily? LoadFontFamily(string path, Action<string>? log = null)
        {
            try
            {
                var factory = DWriteFactory;
                using var f5 = factory.QueryInterface<DW.IDWriteFactory5>();
                using var builder = f5.CreateFontSetBuilder();
                using var file = factory.CreateFontFileReference(path, null);
                builder.AddFontFile(file);
                using var fontSet = builder.CreateFontSet();
                var collection = f5.CreateFontCollectionFromFontSet(fontSet);
                if (collection.FontFamilyCount == 0)
                {
                    collection.Dispose();
                    log?.Invoke("[VrDraw] Font file contains no families");
                    return null;
                }
                using var family = collection.GetFontFamily(0);
                using var names = family.FamilyNames;
                string name = GetFirstString(names) ?? "Material Symbols Rounded";
                return new FontFamily(name, collection);
            }
            catch (Exception ex)
            {
                log?.Invoke($"[VrDraw] Font load failed: {ex.Message}");
                return null;
            }
        }

        private static string? GetFirstString(DW.IDWriteLocalizedStrings strings)
        {
            try
            {
                if (strings.Count == 0) return null;
                return strings.GetString(0);
            }
            catch { return null; }
        }
    }

    public sealed class D2DGraphics : IDisposable
    {
        private readonly D2DRenderer _r;
        private readonly D2D.ID2D1DeviceContext _dc;
        private readonly List<byte> _clips = new();
        private bool _ended;

        public TextRenderingHint TextRenderingHint { get; set; } = TextRenderingHint.AntiAlias;
        public InterpolationMode InterpolationMode { get; set; } = InterpolationMode.Bilinear;
        public PixelOffsetMode PixelOffsetMode { get; set; } = PixelOffsetMode.None;

        public SmoothingMode SmoothingMode
        {
            get => _dc.AntialiasMode == D2D.AntialiasMode.Aliased ? SmoothingMode.None : SmoothingMode.AntiAlias;
            set => _dc.AntialiasMode = value == SmoothingMode.None ? D2D.AntialiasMode.Aliased : D2D.AntialiasMode.PerPrimitive;
        }

        internal D2DGraphics(D2DRenderer renderer, D2D.ID2D1Bitmap1 target)
        {
            _r = renderer;
            _dc = renderer.DC;
            _dc.Target = target;
            _dc.BeginDraw();
            _dc.Transform = Matrix3x2.Identity;
            _dc.AntialiasMode = D2D.AntialiasMode.PerPrimitive;
            _dc.TextAntialiasMode = D2D.TextAntialiasMode.Grayscale;
        }

        public void Dispose()
        {
            if (_ended) return;
            _ended = true;
            PopTo(0);
            _dc.Transform = Matrix3x2.Identity;
            try { _dc.EndDraw(); }
            finally { _dc.Target = null; }
        }

        public void ScaleTransform(float sx, float sy)
            => _dc.Transform = Matrix3x2.CreateScale(sx, sy) * _dc.Transform;

        public void TranslateTransform(float dx, float dy)
            => _dc.Transform = Matrix3x2.CreateTranslation(dx, dy) * _dc.Transform;

        public GraphicsState Save() => new(_clips.Count, _dc.Transform);

        public void Restore(GraphicsState state)
        {
            PopTo(state.ClipDepth);
            _dc.Transform = state.Transform;
        }

        public ClipRegion Clip
        {
            get => new(_clips.Count);
            set => PopTo(value?.Depth ?? 0);
        }

        public void SetClip(ClipRegion region, CombineMode mode) => PopTo(region.Depth);

        public void SetClip(SDRect rect, CombineMode mode)
        {
            _dc.PushAxisAlignedClip(new RawRectF(rect.Left, rect.Top, rect.Right, rect.Bottom), D2D.AntialiasMode.Aliased);
            _clips.Add(0);
        }

        public void SetClip(GraphicsPath path, CombineMode mode)
        {
            var lp = new D2D.LayerParameters1
            {
                ContentBounds = new RawRectF(-1e6f, -1e6f, 1e6f, 1e6f),
                GeometricMask = path.GetGeometry(_r.Factory),
                MaskAntialiasMode = D2D.AntialiasMode.PerPrimitive,
                MaskTransform = Matrix3x2.Identity,
                Opacity = 1f,
                OpacityBrush = null,
                LayerOptions = D2D.LayerOptions1.None,
            };
            _dc.PushLayer(ref lp, null);
            _clips.Add(1);
        }

        public void ResetClip() => PopTo(0);

        private void PopTo(int depth)
        {
            while (_clips.Count > depth)
            {
                byte kind = _clips[^1];
                _clips.RemoveAt(_clips.Count - 1);
                if (kind == 0) _dc.PopAxisAlignedClip();
                else _dc.PopLayer();
            }
        }

        public void Clear(SDColor color) => _dc.Clear(D2DRenderer.ToColor4(color));

        private D2D.ID2D1Brush Materialize(Brush brush) => brush switch
        {
            SolidBrush sb => _r.GetSolid(sb.Color),
            LinearGradientBrush lg => lg.GetD2D(_dc),
            _ => throw new NotSupportedException(brush.GetType().Name),
        };

        public void FillRectangle(Brush brush, float x, float y, float w, float h)
        {
            if (w <= 0f || h <= 0f) return;
            _dc.FillRectangle(new RawRectF(x, y, x + w, y + h), Materialize(brush));
        }

        public void FillRectangle(Brush brush, SDRectF rect) => FillRectangle(brush, rect.X, rect.Y, rect.Width, rect.Height);

        public void DrawRectangle(Pen pen, float x, float y, float w, float h)
            => _dc.DrawRectangle(new RawRectF(x, y, x + w, y + h), _r.GetSolid(pen.Color), pen.Width);

        public void FillEllipse(Brush brush, float x, float y, float w, float h)
            => _dc.FillEllipse(new D2D.Ellipse(new Vector2(x + w / 2f, y + h / 2f), w / 2f, h / 2f), Materialize(brush));

        public void DrawEllipse(Pen pen, float x, float y, float w, float h)
            => _dc.DrawEllipse(new D2D.Ellipse(new Vector2(x + w / 2f, y + h / 2f), w / 2f, h / 2f), _r.GetSolid(pen.Color), pen.Width);

        public void DrawLine(Pen pen, float x1, float y1, float x2, float y2)
            => _dc.DrawLine(new Vector2(x1, y1), new Vector2(x2, y2), _r.GetSolid(pen.Color), pen.Width);

        public void FillPolygon(Brush brush, SDPointF[] points)
        {
            if (points.Length < 3) return;
            using var pg = _r.Factory.CreatePathGeometry();
            using (var sink = pg.Open())
            {
                sink.BeginFigure(new Vector2(points[0].X, points[0].Y), D2D.FigureBegin.Filled);
                for (int i = 1; i < points.Length; i++)
                    sink.AddLine(new Vector2(points[i].X, points[i].Y));
                sink.EndFigure(D2D.FigureEnd.Closed);
                sink.Close();
            }
            _dc.FillGeometry(pg, Materialize(brush), null);
        }

        public void FillPath(Brush brush, GraphicsPath path)
            => _dc.FillGeometry(path.GetGeometry(_r.Factory), Materialize(brush), null);

        public void DrawPath(Pen pen, GraphicsPath path)
            => _dc.DrawGeometry(path.GetGeometry(_r.Factory), _r.GetSolid(pen.Color), pen.Width);

        public void DrawString(string? text, Font font, Brush brush, SDRectF rect)
            => DrawString(text, font, brush, rect, null);

        public void DrawString(string? text, Font font, Brush brush, SDRectF rect, StringFormat? fmt)
        {
            if (string.IsNullOrEmpty(text) || rect.Width <= 0f || rect.Height <= 0f) return;
            var tf = D2DRenderer.GetTextFormat(font, fmt);
            float x = rect.X, w = rect.Width;
            if (fmt == null || !fmt.Typographic)
            {
                float pad = font.SizeDip / 6f;
                var align = fmt?.Alignment ?? StringAlignment.Near;
                if (align == StringAlignment.Near) { x += pad; w = MathF.Max(0f, w - pad); }
                else if (align == StringAlignment.Far) { w = MathF.Max(0f, w - pad); }
            }
            _dc.DrawText(text, tf, new Rect(x, rect.Y, w, rect.Height), Materialize(brush), D2D.DrawTextOptions.Clip);
        }

        public SDSizeF MeasureString(string? text, Font font)
        {
            if (string.IsNullOrEmpty(text)) return new SDSizeF(0f, 0f);
            var tf = D2DRenderer.GetTextFormat(font, null);
            using var layout = D2DRenderer.DWriteFactory.CreateTextLayout(text, tf, 1e6f, 1e6f);
            var m = layout.Metrics;
            return new SDSizeF(m.WidthIncludingTrailingWhitespace + font.SizeDip / 3f, m.Height);
        }

        public void DrawImage(VrBitmap image, SDRect dest)
            => DrawImageCore(image, dest, new SDRectF(0f, 0f, image.Width, image.Height), 1f);

        public void DrawImage(VrBitmap image, SDRect dest, SDRect src, GraphicsUnit unit)
            => DrawImageCore(image, dest, src, 1f);

        public void DrawImage(VrBitmap image, SDRect dest, SDRect src, float opacity)
            => DrawImageCore(image, dest, src, opacity);

        private void DrawImageCore(VrBitmap image, SDRectF dest, SDRectF src, float opacity)
        {
            var gpu = image.GetGpu(_r);
            if (gpu == null) return;
            _dc.DrawBitmap(gpu,
                new RawRectF(dest.Left, dest.Top, dest.Right, dest.Bottom),
                Math.Clamp(opacity, 0f, 1f), MapInterp(),
                new RawRectF(src.Left, src.Top, src.Right, src.Bottom), null);
        }

        public void DrawImageBlurred(VrBitmap image, SDRect dest, int tinyW, int tinyH)
        {
            var tiny = image.GetTiny(_r, tinyW, tinyH);
            if (tiny == null) { DrawImage(image, dest); return; }
            _dc.DrawBitmap(tiny,
                new RawRectF(dest.Left, dest.Top, dest.Right, dest.Bottom),
                1f, D2D.InterpolationMode.HighQualityCubic, null, null);
        }

        private D2D.InterpolationMode MapInterp() => InterpolationMode switch
        {
            InterpolationMode.NearestNeighbor => D2D.InterpolationMode.NearestNeighbor,
            InterpolationMode.HighQualityBicubic => D2D.InterpolationMode.HighQualityCubic,
            _ => D2D.InterpolationMode.Linear,
        };
    }
}
#endif
