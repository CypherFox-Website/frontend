// src/routes/Others/Creditos.jsx
import React, { useEffect, useRef } from 'react';
import './Creditos.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ReflectiveCard from '../../components/cards/ReflectiveCard';
import Stack, { BookCard } from '../../components/cards/Stack';
import Aurora from '../../components/bg/Aurora';
import DecryptedText from '../../components/text/DecryptedText';

gsap.registerPlugin(ScrollTrigger);

const Creditos = () => {
  const pageRef = useRef(null);
  const teamSectionRef = useRef(null);
  const biblioSectionRef = useRef(null);

  const books = [
    {
      title: 'Handbook of Applied Cryptography',
      author: 'Alfred J. Menezes, Paul C. van Oorschot, Scott A. Vanstone',
      cover:
        'https://m.media-amazon.com/images/I/61jB+1DzU0L._AC_UF1000,1000_QL80_.jpg'
    },
    {
      title: 'A Graduate Course in Applied Cryptography',
      author: 'Dan Boneh, Victor Shoup',
      cover:
        'https://m.media-amazon.com/images/I/71GSesdcCGL._UF1000,1000_QL80_.jpg'
    },
    {
      title: 'Introduction to Cryptography: Principles and Applications',
      author: 'Hans Delfs, Helmut Knebl',
      cover:
        'https://m.media-amazon.com/images/I/61dYyImisOL._AC_UF1000,1000_QL80_.jpg'
    },
    {
      title: 'Introduction to Cryptography',
      author: 'Johannes A. Buchmann',
      cover:
        'https://m.media-amazon.com/images/I/619jHCmMz8L._AC_UF1000,1000_QL80_.jpg'
    },
    {
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
      cover:
        'https://m.media-amazon.com/images/I/61Mw06x2XcL._AC_UF1000,1000_QL80_.jpg'
    },
    {
      title: 'La estructura de los números',
      author: 'Gregorio M. Ordóñez',
      cover:
        'https://m.media-amazon.com/images/I/81IgyKC6JgL.jpg'
    },
    {
      title: 'Introduction to Modern Cryptography',
      author: 'Jonathan Katz, Yehuda Lindell',
      cover: 'https://m.media-amazon.com/images/I/71LZ2jJUu7L._AC_UF1000,1000_QL80_.jpg'
    },
    {
      title: 'Understanding Cryptography: A Textbook for Students and Practitioners',
      author: 'Christof Paar, Jan Pelzl',
      cover: 'https://m.media-amazon.com/images/I/61hks+Gh+YL._AC_UF1000,1000_QL80_.jpg'
    },
    {
      title: 'Introducción a la criptografía y a la seguridad de la información',
      author: 'Yoan Pinzón',
      cover: 'https://media.licdn.com/dms/image/v2/D4D12AQHDSHdeTkOP7A/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1660857820877?e=2147483647&v=beta&t=lbPXWwmBjZ5mXNCgcu7rbsbSeUl2h9ObDN1rIpAFw7s'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cred-team', {
        opacity: 0,
        y: 40,
        duration: 2,
        ease: 'power3.out'
      });

      gsap.from('.cred-team-card', {
        scrollTrigger: {
          trigger: teamSectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        rotateX: -10,
        duration: 2,
        ease: 'power3.out',
        stagger: 0.15
      });

      gsap.from('.cred-biblio-title', {
        scrollTrigger: {
          trigger: biblioSectionRef.current,
          start: 'top 85%'
        },
        opacity: 0,
        y: 20,
        duration: 2,
        ease: 'power3.out'
      });

      gsap.from('.cred-biblio-stack-wrapper', {
        scrollTrigger: {
          trigger: biblioSectionRef.current,
          start: 'top 80%'
        },
        opacity: 0,
        y: 30,
        scale: 2,
        duration: 1,
        ease: 'power3.out'
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="cred-page" ref={pageRef}>
      {/* FONDO */}
      <div className="cred-bg">
        <Aurora
          colorStops={['#138245', '#06040E', '#e78f41']}
          amplitude={5}
          blend={1}
          speed={2}
        />
      </div>

      {/* EQUIPO */}
      <section className="cred-team" ref={teamSectionRef}>
        <h2 className="cred-team-tittle">
          <DecryptedText
            text="Equipo CypherFox"
            className="cred-team-tittle"
            encryptedClassName="cred-team-tittle--encrypted"
            speed={120}
            maxIterations={60}
            sequential={true}
            revealDirection="start"
            useOriginalCharsOnly={false}
            animateOn="both"
          />
        </h2>

        <div className="container">
          <div className="row gy-4 cred-team-list justify-content-center">
            <div className="col-8 col-md-4 col-lg-3 d-flex justify-content-center cred-team-card">
              <ReflectiveCard
                blurStrength={1}
                backgroundImage="https://avatars.githubusercontent.com/u/69637072?v=4"
                userName="MARÍA JOSÉ JARA"
                userRole="Desarrolladora Full Stack"
                idValue="2025-CRYPTO-001"
                secureLabel="CYPHERFOX ACCESS"
              />
            </div>

            <div className="col-8 col-md-4 col-lg-3 d-flex justify-content-center cred-team-card">
              <ReflectiveCard
                blurStrength={1}
                backgroundImage="https://lh3.googleusercontent.com/a-/ALV-UjWOSRaBKzSJaUMYzaJzgDOCN0vlrWUdqdJmAwZuY2532nPpuVCg=s240-p-k-rw-no"
                userName="JORGE ELIECER CAMARGO"
                userRole="Director de Proyecto"
                idValue="2025-CRYPTO-002"
                secureLabel="CYPHERFOX ACCESS"
              />
            </div>

            <div className="col-8 col-md-4 col-lg-3 d-flex justify-content-center cred-team-card">
              <ReflectiveCard
                blurStrength={1}
                backgroundImage="https://lh3.googleusercontent.com/a-/ALV-UjXSR222rkCbgfw2uPg_DnOvoR5N1BJAYqTLE2sZqD9XOlOTW293=s240-p-k-rw-no"
                userName="LAURA CAMILA PINZON"
                userRole="Artista"
                idValue="2025-CRYPTO-003"
                secureLabel="CYPHERFOX ACCESS"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BIBLIOGRAFÍA */}
      <section className="cred-biblio" ref={biblioSectionRef}>
        <h2 className="cred-biblio-title">
          <DecryptedText
            text="Bibliografía"
            className="cred-team-tittle"
            encryptedClassName="cred-team-tittle--encrypted"
            speed={120}
            maxIterations={60}
            sequential={true}
            revealDirection="start"
            useOriginalCharsOnly={false}
            animateOn="both"
          />
        </h2>

        <div className="cred-biblio-stack-wrapper">
          <Stack
            randomRotation
            autoplay
            autoplayDelay={3500}
            pauseOnHover
            sendToBackOnClick
            mobileClickOnly
            cards={books.slice()
              .reverse()
              .map(book => (
                <BookCard
                  key={book.title}
                  cover={book.cover}
                  title={book.title}
                  author={book.author}
                />
              ))}
          />
        </div>
      </section>
    </div>
  );
};

export default Creditos;