import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import './App.css'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

const skills = [
  {
    title: 'Java Development',
    items: ['Core Java', 'OOP', 'Collections', 'Exception Handling'],
  },
  {
    title: 'Web Development',
    items: ['HTML5', 'CSS3', 'JavaScript', 'React.js'],
  },
  {
    title: 'Testing',
    items: ['Manual Testing', 'Regression', 'Test Cases', 'Defect Tracking'],
  },
  {
    title: 'API & Automation',
    items: ['Postman', 'REST API', 'Selenium', 'TestNG'],
  },
]

const experience = [
  {
    role: 'Java Developer and Software Testing Intern',
    company: 'QSpiders',
    period: 'February 2026 – Present',
    description: 'Currently building hands-on experience in Java programming, SQL, API testing, and Selenium automation with Java and TestNG.',
  },
  {
    role: 'MCA Student',
    company: 'Madanapalle Institute of Technology and Science',
    period: '2024 – 2026',
    description: 'Developing a strong foundation in software engineering, databases, web technologies, and application development practices.',
  },
]

const projects = [
  {
    name: 'HepatoAI',
    summary: 'A smart diagnostic platform for early hepatitis prediction using machine learning and a web-based interface.',
    stack: ['React.js', 'Python', 'Flask', 'MongoDB', 'Machine Learning'],
    repository: 'https://github.com/Bandarlajeevan1/hepatoAI-early-hepatisis-predector',
  },
  {
    name: 'Resume Analyzer',
    summary: 'An academic project for analyzing resumes against job requirements and highlighting match quality.',
    stack: ['HTML', 'CSS', 'React.js', 'Python', 'NLP', 'MongoDB'],
    repository: 'https://github.com/Bandarlajeevan1/AI-based-resume',
  },
]

const education = [
  {
    degree: 'MCA',
    title: 'Master of Computer Applications',
    institution: 'Madanapalle Institute of Technology and Science',
  },
  {
    degree: 'B.SC. M.E.C.S.',
    title: 'Bachelor of Science',
    institution: 'Vishwam Degree College',
  },
]

const portfolioProfileImage = '/images/jeevan-profile.png'
const resumeHref = '/resume.pdf'
const resumeFileName = 'Bandarla_Jeevan_Resume.pdf'
const heroVideoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4'
const heroIntro = 'Glad you stopped by. I build applications, solve technical problems and turn ideas into working software.'
const SENSITIVITY = 0.8

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [emailCopied, setEmailCopied] = useState(false)
  const [resumeModalOpen, setResumeModalOpen] = useState(false)
  const [resumeLoading, setResumeLoading] = useState(true)
  const [resumeError, setResumeError] = useState(false)
  const videoRef = useRef(null)
  const resumeTimeoutRef = useRef(null)
  const previousXRef = useRef(null)
  const seekTargetRef = useRef(0)
  const seekQueuedRef = useRef(false)
  const seekInProgressRef = useRef(false)

  useEffect(() => {
    let timeoutId = null
    let intervalId = null

    timeoutId = window.setTimeout(() => {
      let index = 0
      intervalId = window.setInterval(() => {
        index += 1
        setTypedText(heroIntro.slice(0, index))

        if (index >= heroIntro.length) {
          window.clearInterval(intervalId)
        }
      }, 38)
    }, 600)

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    const handleMouseMove = (event) => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return

      const currentX = event.clientX
      if (previousXRef.current === null) {
        previousXRef.current = currentX
        return
      }

      const delta = currentX - previousXRef.current
      previousXRef.current = currentX
      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration
      const destination = Math.min(Math.max(video.currentTime + timeOffset, 0), video.duration)
      seekTargetRef.current = destination

      if (seekInProgressRef.current) {
        seekQueuedRef.current = true
        return
      }

      seekInProgressRef.current = true

      const seekToCurrentTarget = () => {
        const target = seekTargetRef.current
        video.currentTime = target

        const handleSeeked = () => {
          seekInProgressRef.current = false
          if (seekQueuedRef.current) {
            seekQueuedRef.current = false
            seekToCurrentTarget()
          }
          video.removeEventListener('seeked', handleSeeked)
        }

        video.addEventListener('seeked', handleSeeked, { once: true })
      }

      seekToCurrentTarget()
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      previousXRef.current = null
    }
  }, [])

  const handleCopyEmail = async () => {
    const emailAddress = 'bandarlajeevan@gmail.com'

    try {
      await navigator.clipboard.writeText(emailAddress)
      setEmailCopied(true)
      window.setTimeout(() => setEmailCopied(false), 1800)
    } catch (error) {
      setEmailCopied(false)
    }
  }

  const openResumeModal = () => {
    setResumeLoading(true)
    setResumeError(false)
    setResumeModalOpen(true)
  }

  const closeResumeModal = () => {
    setResumeModalOpen(false)
    setResumeLoading(true)
    setResumeError(false)
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current)
      resumeTimeoutRef.current = null
    }
  }

  useEffect(() => {
    if (!resumeModalOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeResumeModal()
      }
    }

    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current)
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      setResumeLoading(false)
    }, 2500)

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current)
        resumeTimeoutRef.current = null
      }
    }
  }, [resumeModalOpen])

  return (
    <>
      <header className="site-header">
        <div className="container nav-wrap">
          <a href="#home" className="brand">
            B. JEEVAN
          </a>

          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <a href="#contact" className="nav-cta">
              Get in Touch
            </a>
            <button
              type="button"
              className={`nav-toggle ${menuOpen ? 'is-open' : ''}`}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <main id="home">
        <section className="hero-section">
          <div className="hero-video-shell" aria-hidden="true">
            <video
              ref={videoRef}
              className="hero-video"
              src={heroVideoUrl}
              muted
              playsInline
              preload="auto"
              autoPlay={false}
              loop
              controls={false}
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <div className="hero-overlay" aria-hidden="true" />

          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="hero-kicker">HELLO, I'M B. JEEVAN</p>
              <p className="hero-subtitle">JAVA DEVELOPER | FULL STACK DEVELOPER | SOFTWARE TESTER</p>

              <div className="hero-typewriter-wrap">
                <span className="hero-typewriter" aria-live="polite">
                  {typedText}
                </span>
                <span className="type-cursor" aria-hidden="true" />
              </div>

              <div className="hero-actions">
                <a href="#projects" className="hero-button">
                  Explore My Projects
                </a>
                <a href="#skills" className="hero-button">
                  View My Skills
                </a>
                <a href="#experience" className="hero-button">
                  My Experience
                </a>
                <button type="button" className="hero-button resume-trigger-button" onClick={openResumeModal}>
                  View Resume
                </button>
                <a href="#contact" className="hero-button">
                  Contact Me
                </a>
              </div>

              <div className="hero-email-row">
                <span className="hero-email-label">Reach me:</span>
                <a href="mailto:bandarlajeevan@gmail.com" className="hero-email-link">
                  bandarlajeevan@gmail.com
                </a>
                <button type="button" className="copy-email-button" onClick={handleCopyEmail} aria-label="Copy email address">
                  {emailCopied ? <Check size={16} /> : <Copy size={16} />}
                </button>
                {emailCopied && <span className="copy-status">Email copied!</span>}
              </div>
            </div>
          </div>
        </section>

        <section className="section-block" id="about">
          <div className="container split-layout">
            <div className="hero-visual">
              <div className="portrait-card">
                <span className="portrait-glow" />
                <img
                  src={portfolioProfileImage}
                  alt="B. Jeevan portrait"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.style.background = '#DDE3E8'
                    event.currentTarget.style.objectFit = 'contain'
                    event.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
                        <rect width="800" height="1000" fill="#DDE3E8"/>
                        <circle cx="400" cy="330" r="170" fill="#3A0F34" fill-opacity="0.2"/>
                        <rect x="250" y="500" width="300" height="260" rx="60" fill="#3A0F34" fill-opacity="0.18"/>
                        <text x="400" y="820" text-anchor="middle" font-size="48" font-family="Arial, sans-serif" fill="#3A0F34">Profile image unavailable</text>
                      </svg>
                    `)
                  }}
                />
              </div>
            </div>

            <div className="section-heading">
              <p className="section-kicker">About</p>
              <h2>About Me</h2>
              <div className="about-content">
                <p>
                  I am B. Jeevan, an MCA graduate with a strong interest in Java development, software testing, and full-stack web development. I enjoy working with programming concepts, databases, application logic, and user-facing interfaces.
                </p>
                <p>
                  My learning journey includes Java, HTML, CSS, JavaScript, React.js, SQL, API testing, Selenium, and TestNG. I am especially interested in building reliable applications that are both technically sound and practical for real-world use.
                </p>
                <p>
                  Through my internship at QSpiders, I continue to build hands-on experience in Java programming, testing, networking concepts, and automation, while strengthening my technical foundation in software engineering.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block skill-section" id="skills">
          <div className="container">
            <div className="section-heading center-heading">
              <p className="section-kicker">Skills</p>
              <h2>Technical Expertise</h2>
            </div>

            <div className="skill-grid">
              {skills.map((skill) => (
                <article className="skill-card" key={skill.title}>
                  <h3>{skill.title}</h3>
                  <ul>
                    {skill.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block terminal-showcase" id="projects">
          <div className="container terminal-wrap">
            <div className="section-heading left-heading">
              <p className="section-kicker">Projects</p>
              <h2>Selected Work</h2>
            </div>

            <div className="terminal-window">
              <div className="terminal-header">
                <span className="window-dot red" />
                <span className="window-dot yellow" />
                <span className="window-dot green" />
              </div>
              <pre>{`$ Projects
-- HepatoAI: Smart hepatitis diagnostic platform
-- Resume Analyzer: Match resume skills against job criteria
-- Java & API testing workflows with Postman and Selenium`}</pre>
            </div>
          </div>
        </section>

        <section className="section-block projects-section">
          <div className="container projects-container">
            <div className="section-heading center-heading">
              <p className="section-kicker">Projects</p>
              <h2>Academic Projects</h2>
            </div>

            <div className="project-grid">
              {projects.map((project) => (
                <article className="project-card" key={project.name}>
                  <span className="project-badge">Academic Project</span>
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                  <ul className="project-technologies">
                    {project.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <a
                    className="project-repository-link"
                    href={project.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 .2a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.36c-2.23.49-2.7-.95-2.7-.95-.36-.93-.89-1.18-.89-1.18-.73-.5.06-.49.06-.49.8.06 1.22.82 1.22.82.72 1.22 1.88.87 2.34.66.07-.52.28-.87.51-1.07-1.78-.2-3.65-.89-3.65-3.96 0-.88.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.7 7.7 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.08-1.87 3.75-3.66 3.95.29.25.55.73.55 1.48v2.1c0 .21.15.46.55.38A8 8 0 0 0 8 .2Z" />
                    </svg>
                    <span>View GitHub Repository</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block dark-section" id="experience">
          <div className="container">
            <div className="section-heading center-heading">
              <p className="section-kicker">Experience</p>
              <h2>My Journey</h2>
            </div>

            <div className="timeline">
              {experience.map((item) => (
                <div className="timeline-item" key={`${item.company}-${item.period}`}>
                  <span className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h3>{item.role}</h3>
                      <span>{item.period}</span>
                    </div>
                    <div className="timeline-company">{item.company}</div>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block" id="education">
          <div className="container">
            <div className="section-heading center-heading">
              <p className="section-kicker">Education</p>
              <h2>Academic Background</h2>
            </div>

            <div className="edu-grid">
              {education.map((item) => (
                <article className="edu-card" key={item.degree}>
                  <div className="edu-category">{item.degree}</div>
                  <h3 className="edu-degree-title">{item.title}</h3>
                  <p className="edu-institution">{item.institution}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block" id="contact">
          <div className="container contact-wrap">
            <div className="contact-copy">
              <p className="section-kicker">Let's Connect</p>
              <h2>Let&apos;s Work Together</h2>
              <p>
                I&apos;m open to opportunities, internships, and technical discussions related to Java development, software testing, and web development.
              </p>
            </div>

            <div className="contact-card">
              <a href="mailto:bandarlajeevan@gmail.com">bandarlajeevan@gmail.com</a>
              <a href="https://www.linkedin.com/in/jeevan-bandarla-ab01a2342/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://github.com/Bandarlajeevan1" target="_blank" rel="noreferrer">GitHub</a>
              <button type="button" className="resume-trigger-button contact-resume-link" onClick={openResumeModal} aria-label="Open the resume preview modal">
                View Resume
              </button>
            </div>
          </div>
        </section>
      </main>

      {resumeModalOpen && (
        <div className="resume-modal-backdrop" onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeResumeModal()
          }
        }}>
          <div className="resume-modal" role="dialog" aria-modal="true" aria-labelledby="resume-modal-title">
            <div className="resume-modal-header">
              <h2 id="resume-modal-title">B. JEEVAN — MY RESUME</h2>

              <div className="resume-modal-actions">
                <a href={resumeHref} download={resumeFileName} className="resume-download-button">
                  Download Resume
                </a>
                <button type="button" className="resume-close-button" onClick={closeResumeModal} aria-label="Close resume preview">
                  ×
                </button>
              </div>
            </div>

            <div className="resume-modal-body">
              {resumeLoading && !resumeError && (
                <div className="resume-loading-state">Loading resume...</div>
              )}

              {!resumeError && !resumeLoading && (
                <iframe
                  className="resume-iframe"
                  src={resumeHref}
                  title="B. Jeevan Resume"
                  loading="lazy"
                  onLoad={() => setResumeLoading(false)}
                  onError={() => {
                    setResumeLoading(false)
                    setResumeError(true)
                  }}
                />
              )}

              {resumeError && (
                <div className="resume-error-state">
                  <p>Unable to preview the resume. You can download it instead.</p>
                  <a href={resumeHref} download={resumeFileName} className="resume-download-button">
                    Download Resume
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>B. JEEVAN</span>
          <span>Building applications and learning by doing.</span>
          <span>© 2026</span>
        </div>
      </footer>
    </>
  )
}

export default App
