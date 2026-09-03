#if WINDOWS
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace VRCNext.Services;

public static class ScreenColorPickerService
{
    private static int _active;

    public static void Start(Action<string> onPicked, Action onCancelled)
    {
        if (Interlocked.Exchange(ref _active, 1) == 1) { onCancelled(); return; }
        var t = new Thread(() =>
        {
            string? picked = null;
            try
            {
                var vs = SystemInformation.VirtualScreen;
                using var shot = new Bitmap(vs.Width, vs.Height, System.Drawing.Imaging.PixelFormat.Format32bppRgb);
                using (var g = Graphics.FromImage(shot))
                    g.CopyFromScreen(vs.Left, vs.Top, 0, 0, vs.Size);
                using var form = new LoupeForm(shot, vs, hex => picked = hex);
                Application.Run(form);
            }
            catch { }
            finally
            {
                try { if (picked != null) onPicked(picked); else onCancelled(); } catch { }
                Interlocked.Exchange(ref _active, 0);
            }
        });
        t.SetApartmentState(ApartmentState.STA);
        t.IsBackground = true;
        t.Start();
    }

    private sealed class LoupeForm : Form
    {
        private const int Zoom = 14;
        private const int Cells = 11;
        private const int LoupeD = Zoom * Cells;

        private readonly Bitmap _shot;
        private readonly Action<string> _pick;
        private Point _cur;
        private bool _cursorHidden;

        public LoupeForm(Bitmap shot, Rectangle vs, Action<string> pick)
        {
            _shot = shot;
            _pick = pick;
            SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);
            FormBorderStyle = FormBorderStyle.None;
            StartPosition = FormStartPosition.Manual;
            Bounds = vs;
            TopMost = true;
            ShowInTaskbar = false;
            KeyPreview = true;
            _cur = new Point(Cursor.Position.X - vs.Left, Cursor.Position.Y - vs.Top);
        }

        protected override CreateParams CreateParams
        {
            get
            {
                var cp = base.CreateParams;
                cp.ExStyle |= 0x80;
                return cp;
            }
        }

        protected override void OnShown(EventArgs e)
        {
            base.OnShown(e);
            Cursor.Hide();
            _cursorHidden = true;
            Activate();
        }

        protected override void OnFormClosed(FormClosedEventArgs e)
        {
            if (_cursorHidden) { Cursor.Show(); _cursorHidden = false; }
            base.OnFormClosed(e);
        }

        protected override void OnMouseMove(MouseEventArgs e)
        {
            base.OnMouseMove(e);
            var old = DirtyBounds(_cur);
            _cur = e.Location;
            Invalidate(Rectangle.Union(old, DirtyBounds(_cur)));
        }

        protected override void OnMouseDown(MouseEventArgs e)
        {
            base.OnMouseDown(e);
            if (e.Button == MouseButtons.Left) _pick(Hex(ColorAt(e.Location)));
            Close();
        }

        protected override void OnKeyDown(KeyEventArgs e)
        {
            base.OnKeyDown(e);
            if (e.KeyCode == Keys.Escape) Close();
        }

        private static Rectangle DirtyBounds(Point c)
        {
            return new Rectangle(c.X - LoupeD / 2 - 60, c.Y - LoupeD / 2 - 44, LoupeD + 120, LoupeD + 92);
        }

        private Color ColorAt(Point p)
        {
            var x = Math.Clamp(p.X, 0, _shot.Width - 1);
            var y = Math.Clamp(p.Y, 0, _shot.Height - 1);
            return _shot.GetPixel(x, y);
        }

        private static string Hex(Color c) => $"#{c.R:X2}{c.G:X2}{c.B:X2}";

        protected override void OnPaint(PaintEventArgs e)
        {
            var g = e.Graphics;
            g.DrawImage(_shot, e.ClipRectangle, e.ClipRectangle, GraphicsUnit.Pixel);
            DrawLoupe(g, _cur);
        }

        private void DrawLoupe(Graphics g, Point c)
        {
            var color = ColorAt(c);
            var lr = new Rectangle(c.X - LoupeD / 2, c.Y - LoupeD / 2, LoupeD, LoupeD);

            using (var clip = new GraphicsPath())
            {
                clip.AddEllipse(lr);
                var state = g.Save();
                g.SetClip(clip);
                using (var bg = new SolidBrush(Color.FromArgb(255, 40, 40, 44)))
                    g.FillEllipse(bg, lr);
                g.InterpolationMode = InterpolationMode.NearestNeighbor;
                g.PixelOffsetMode = PixelOffsetMode.Half;
                var src = new Rectangle(c.X - Cells / 2, c.Y - Cells / 2, Cells, Cells);
                g.DrawImage(_shot, lr, src, GraphicsUnit.Pixel);
                g.SmoothingMode = SmoothingMode.None;
                using (var gridPen = new Pen(Color.FromArgb(46, 0, 0, 0)))
                {
                    for (int i = 1; i < Cells; i++)
                    {
                        g.DrawLine(gridPen, lr.X + i * Zoom, lr.Y, lr.X + i * Zoom, lr.Bottom);
                        g.DrawLine(gridPen, lr.X, lr.Y + i * Zoom, lr.Right, lr.Y + i * Zoom);
                    }
                }
                g.Restore(state);
            }

            var center = new Rectangle(c.X - Zoom / 2, c.Y - Zoom / 2, Zoom, Zoom);
            using (var pOut = new Pen(Color.FromArgb(180, 0, 0, 0)))
                g.DrawRectangle(pOut, Rectangle.Inflate(center, 1, 1));
            using (var pIn = new Pen(Color.White))
                g.DrawRectangle(pIn, center);

            g.SmoothingMode = SmoothingMode.AntiAlias;
            using (var ring = new Pen(color, 6f))
                g.DrawEllipse(ring, lr.X + 3, lr.Y + 3, LoupeD - 7, LoupeD - 7);
            using (var rimIn = new Pen(Color.White, 1.4f))
                g.DrawEllipse(rimIn, lr.X + 6, lr.Y + 6, LoupeD - 13, LoupeD - 13);
            using (var rimOut = new Pen(Color.FromArgb(120, 0, 0, 0), 1.4f))
                g.DrawEllipse(rimOut, lr.X, lr.Y, LoupeD - 1, LoupeD - 1);

            var hex = Hex(color);
            using var font = new Font("Segoe UI", 9f, FontStyle.Bold);
            var sz = g.MeasureString(hex, font);
            var lw = (int)sz.Width + 16;
            var lh = (int)sz.Height + 8;
            var lx = c.X - lw / 2;
            var ly = lr.Bottom + 12;
            if (ly + lh > ClientSize.Height - 4) ly = lr.Top - lh - 12;
            using (var path = RoundedRect(new Rectangle(lx, ly, lw, lh), lh / 2))
            {
                using (var bg = new SolidBrush(Color.FromArgb(235, 32, 33, 36)))
                    g.FillPath(bg, path);
                using (var rim = new Pen(Color.FromArgb(90, 255, 255, 255)))
                    g.DrawPath(rim, path);
            }
            using (var txt = new SolidBrush(Color.White))
                g.DrawString(hex, font, txt, lx + 8, ly + 4);
        }

        private static GraphicsPath RoundedRect(Rectangle r, int rad)
        {
            var p = new GraphicsPath();
            p.AddArc(r.X, r.Y, rad * 2, rad * 2, 180, 90);
            p.AddArc(r.Right - rad * 2, r.Y, rad * 2, rad * 2, 270, 90);
            p.AddArc(r.Right - rad * 2, r.Bottom - rad * 2, rad * 2, rad * 2, 0, 90);
            p.AddArc(r.X, r.Bottom - rad * 2, rad * 2, rad * 2, 90, 90);
            p.CloseFigure();
            return p;
        }
    }
}
#endif
