import React from 'react';
import { Link } from 'react-router-dom';

const libraryImage = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1800&q=85';

const amenities = [
  {
    title: 'Modern Library',
    text: 'Quiet reading spaces, reference books, and guided study sessions.',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Science Lab',
    text: 'Practical experiments that help students understand what they learn.',
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Computer Room',
    text: 'Digital literacy, typing, research, and project-based ICT lessons.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Sports Ground',
    text: 'Football, athletics, teamwork, and healthy competition after class.',
    image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=900&q=80',
  },
];

const remarks = [
  {
    name: 'Awa Jallow',
    role: 'Parent',
    quote: 'My daughter became more confident because her teachers noticed her strengths and kept us informed.',
  },
  {
    name: 'Muhammed Jaiteh',
    role: 'Student',
    quote: 'The library and ICT lessons helped me prepare better projects and improve my grades.',
  },
  {
    name: 'Binta Bojang',
    role: 'Parent',
    quote: 'Attendance, fees, and announcements are easier to follow. The school feels more connected.',
  },
];

const stats = [
  ['95%', 'parent satisfaction'],
  ['18+', 'active subjects'],
  ['45', 'demo students seeded'],
  ['12', 'demo teachers seeded'],
];

export default function Home() {
  return (
    <main style={{ background: '#f7fafc', color: '#0f172a' }}>
      <section
        className="min-vh-100 d-flex flex-column"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(8, 20, 38, 0.86), rgba(8, 20, 38, 0.48), rgba(8, 20, 38, 0.18)), url(${libraryImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <nav className="d-flex align-items-center justify-content-between px-4 px-lg-5 py-3">
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <span
              className="d-inline-flex align-items-center justify-content-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.16)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.22)',
              }}
            >
              <i className="bi bi-mortarboard-fill" />
            </span>
            <span className="fw-bold text-white">Nova Campus</span>
          </Link>

          <div className="d-flex gap-2">
            <Link to="/register" className="btn btn-light btn-sm px-3">Register</Link>
            <Link to="/login" className="btn btn-primary btn-sm px-3">Login</Link>
          </div>
        </nav>

        <div className="container flex-grow-1 d-flex align-items-center py-5">
          <div className="col-lg-7 col-xl-6">
            <span className="badge text-bg-light mb-3">Learning, care, and progress</span>
            <h1 className="display-4 fw-bold text-white mb-3">
              A school home where students feel seen and ready to grow.
            </h1>
            <p className="lead text-white mb-4" style={{ maxWidth: 640, opacity: 0.88 }}>
              Nova Campus brings academics, attendance, communication, and school life into one calm,
              modern experience for families, teachers, and learners.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/login" className="btn btn-primary btn-lg px-4">Login to dashboard</Link>
              <a href="#amenities" className="btn btn-light btn-lg px-4">Explore school life</a>
            </div>
          </div>
        </div>

        <div className="container pb-4">
          <div className="row g-2">
            {stats.map(([value, label]) => (
              <div className="col-6 col-lg-3" key={label}>
                <div
                  className="px-3 py-2"
                  style={{
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.13)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: '#fff',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div className="fw-bold fs-4">{value}</div>
                  <div style={{ fontSize: '0.82rem', opacity: 0.78 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row align-items-end mb-4">
          <div className="col-lg-7">
            <span className="text-primary fw-semibold">What families notice</span>
            <h2 className="fw-bold mt-2 mb-2">Clearer progress, stronger confidence.</h2>
            <p className="mb-0" style={{ color: '#64748b' }}>
              Parents and students can follow school updates, attendance, grades, and classroom progress
              without feeling lost between papers, calls, and missed announcements.
            </p>
          </div>
        </div>

        <div className="row g-3">
          {remarks.map((remark) => (
            <div className="col-md-4" key={remark.name}>
              <article
                className="h-100 p-4"
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                }}
              >
                <i className="bi bi-quote fs-2 text-primary" />
                <p className="mt-3 mb-4" style={{ color: '#334155' }}>{remark.quote}</p>
                <div className="fw-bold">{remark.name}</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{remark.role}</div>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section id="amenities" className="py-5" style={{ background: '#eef6f2' }}>
        <div className="container">
          <div className="row align-items-end mb-4">
            <div className="col-lg-7">
              <span className="text-success fw-semibold">Campus amenities</span>
              <h2 className="fw-bold mt-2 mb-2">Spaces that make learning feel alive.</h2>
              <p className="mb-0" style={{ color: '#52645b' }}>
                From reading corners to practical labs and outdoor play, the school environment supports
                curiosity, discipline, creativity, and friendship.
              </p>
            </div>
          </div>

          <div className="row g-3">
            {amenities.map((item) => (
              <div className="col-md-6 col-xl-3" key={item.title}>
                <article
                  className="h-100 overflow-hidden"
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    borderRadius: 8,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-100"
                    style={{ height: 190, objectFit: 'cover', display: 'block' }}
                  />
                  <div className="p-3">
                    <h3 className="h5 fw-bold mb-2">{item.title}</h3>
                    <p className="mb-0" style={{ color: '#64748b', fontSize: '0.92rem' }}>{item.text}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div
          className="row align-items-center g-4 p-4 p-lg-5"
          style={{
            background: '#0f172a',
            borderRadius: 8,
            color: '#fff',
          }}
        >
          <div className="col-lg-8">
            <h2 className="fw-bold mb-2">Ready to enter the school dashboard?</h2>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Use the seeded superadmin account to explore teachers, students, classes, and school records.
            </p>
          </div>
          <div className="col-lg-4 d-flex gap-2 justify-content-lg-end flex-wrap">
            <Link to="/login" className="btn btn-primary px-4">Login</Link>
            <Link to="/register" className="btn btn-outline-light px-4">Registration info</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
