/* eslint-disable @next/next/no-img-element */
// import { FindDoctorCard, Search, VideoConsultationCard } from '@app/components';
import { Container } from '@libs/ui';
import Specialities from './Specialities';
import './style.css';

export default function Home() {
  return (
    <div className="min-h-screen bg-inherit" style={{ minHeight: 1800 }}>
      {/* Hero Section */}

      <section className="py-10 bg-primary-50 dark:bg-gray-800 section-search text-center dark:bg-blend-multiply relative">
        {/* <div className="container mx-auto text-center"> */}
        <Container maxWidth="lg">
          <h2 className="text-4xl font-bold mb-5 dark:text-white">
            Find the <span className="text-primary font-extrabold">Best</span>{' '}
            Doctors Near You
          </h2>
          <p className="text-lg mb-8 text-gray-500 dark:text-gray-300">
            Search by location or specialist to book your next appointment.
          </p>
          {/* <Search /> */}
        </Container>
        <img
          src="https://healthconnect247.com/wp-content/uploads/2021/11/7.png"
          alt="ss"
          className="absolute w-72 h-72 top-10 right-10 opacity-60 hidden md:block"
        />
        {/* </div> */}
      </section>

      {/* Specialists Section */}
      <section className="py-10">
        <Container isPatient>
          <div className="flex flex-col items-center md:flex-row md:justify-center gap-10">
            {/* <VideoConsultationCard />
            <FindDoctorCard /> */}
          </div>
        </Container>
      </section>
      <Specialities />
    </div>
  );
}
