function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">About Us – Titans Careers</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-4 text-lg">
            At Titans Careers, we are passionate about empowering individuals to
            achieve their professional dreams in compliance and IT. Formerly
            known as Pro Trainers, we have evolved to meet the growing demands
            of the job market while staying committed to our core mission —
            bridging the gap between training and employment.
          </p>
          <p className="mb-4 text-lg">
            Our greatest asset is our distinguished faculty. Titans Careers is
            proud to be home to a team of industry veterans who bring decades of
            hands-on experience to the classroom. Our facilitators aren't just
            instructors; they are seasoned professionals who have lived the
            challenges and triumphs of the compliance and IT sectors. Deeply
            immersed in their practice, they understand what employers look for
            and what it takes to succeed.
          </p>
        </div>
        <div className="rounded-lg bg-gray-100 p-6">
          <h2 className="mb-4 text-xl font-semibold">Our Values</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>Innovation in learning and skill development</li>
            <li>Accessibility to quality work experience for all</li>
            <li>Industry-relevant projects and mentorship</li>
            <li>Community-driven growth and support</li>
            <li>Continuous improvement and adaptation</li>
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-4 text-lg">
          Having trained thousands of professionals over the years, our faculty
          is well-versed in both foundational knowledge and the latest industry
          standards. They are committed to not only teaching but mentoring —
          helping learners gain practical insights, build confidence, and become
          job-ready.
        </p>
        <p className="mb-4 text-lg">
          At Titans Careers, we believe in delivering more than education; we
          deliver transformation. Whether you're starting out or pivoting into a
          new career, Titans Careers equips you with the skills, mindset, and
          support to thrive in today's competitive landscape.
        </p>
        <p className="mb-4 text-lg font-medium">
          Your journey to a rewarding career starts here — with Titans Careers,
          where experience meets opportunity.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
