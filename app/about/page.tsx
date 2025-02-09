import BaseLayout from '@/components/layout/baseLayout';

const About = () => {
  return (
    <BaseLayout className="mx-auto p-6">
      <h1 className="font-archivo-black mb-4 text-4xl font-prompt">
        About this app
      </h1>
      <p className="font-archivo">
        For any inquiries, please email us at{' '}
        <a href="mailto:visa@opensauce.fi" className="text-blue-600">
          visa@opensauce.fi
        </a>
        .
      </p>
    </BaseLayout>
  );
};

export default About;
