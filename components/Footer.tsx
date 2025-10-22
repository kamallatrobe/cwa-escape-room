export default function Footer() {
  const today = '2025-08-20';

  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: '1px solid #ddd',
        padding: '10px',
        textAlign: 'center',
      }}
    >
      <p>© {today} | Student Name: Your Name | Student Number: Your Number</p>
    </footer>
  );
}
