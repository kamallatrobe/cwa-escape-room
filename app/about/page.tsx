export default function AboutPage() {
  return (
    <section aria-labelledby="about-title">
      <h1 id="about-title">About this site</h1>
      <p><strong>Your Name</strong> — Student No: <strong>12345678</strong></p>
      <p>This site helps generate HTML+JS with inline CSS for use in Moodle.</p>

      <h2>How to use (Video)</h2>
      <div style={{ position: 'relative', paddingTop: '56.25%' }}>
        <iframe
          title="How to use this website"
          src="https://www.youtube.com/embed/VIDEO_ID"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}
