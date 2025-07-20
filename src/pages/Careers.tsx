import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
const Careers = () => {
  return (
    <section className="min-h-screen bg-crypto-dark-blue text-white py-20 px-6">
        <Navbar />
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-6">
          Join Our Team at <span className="text-crypto-bright-teal">TraDify</span>
        </h1>
        <p className="text-lg mb-10 text-gray-300">
          At TraDify, we’re building more than just a crypto trading platform—we’re shaping the future of finance. 
          If you’re passionate about blockchain technology, innovation, and making trading accessible to everyone, 
          we’d love to hear from you.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        <div className="bg-crypto-darker-blue p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-crypto-electric-blue mb-2">Why Work With Us?</h2>
          <p className="text-gray-300">
            At TraDify, we offer a dynamic, collaborative, and inclusive work environment where creativity and 
            problem-solving are encouraged. Our team is fully remote, giving you the freedom to work from anywhere 
            while collaborating with professionals from across the globe. We provide opportunities for growth, 
            skill development, and direct impact in the fast-paced world of crypto.
          </p>
        </div>

        <div className="bg-crypto-darker-blue p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-crypto-electric-blue mb-2">Open Roles</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Frontend Developer (React + Tailwind)</li>
            <li>Backend Developer (Node.js / Supabase)</li>
            <li>Marketing & Community Manager</li>
            <li>Customer Support Specialist</li>
            <li>Blockchain Research Analyst</li>
          </ul>
        </div>

        <div className="bg-crypto-darker-blue p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-crypto-electric-blue mb-2">How to Apply</h2>
          <p className="text-gray-300">
            Interested candidates should send their resume and a brief cover letter to 
            <a href="mailto:careers@tradify.io" className="text-crypto-bright-teal hover:underline"> careers@tradify.io</a>. 
            Include the position you’re applying for in the subject line. We look forward to connecting with talented 
            individuals who share our passion for crypto innovation!
          </p>
        </div>
        <Footer />
      </div>
    </section>
  );
};

export default Careers;
