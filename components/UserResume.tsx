import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUserTemplatesBasedOnUserID } from '@/firebase/firebaseSetup';

interface Template {
  id: string;
  name: string;
  data: any;
  imageUrl?: string; 
}

const UserTemplates: React.FC<{ userId: string }> = ({ userId }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const fetchedTemplates = await fetchUserTemplatesBasedOnUserID(userId);
        setTemplates(fetchedTemplates);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Failed to load templates.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [userId]);

  const handleTemplateClick = (templateId: string) => {
    router.push(`/resumepreview`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Saved Resumes</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse border rounded-lg shadow-md bg-white p-4"
            >
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : templates.length === 0 ? (
        <div className="text-center">
          <img
            src="/no-data-illustration.png"
            alt="No templates"
            className="mx-auto w-64 h-64"
          />
          <p className="text-gray-600 mt-4">No templates found. Start creating your first resume!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="relative cursor-pointer border rounded-lg shadow-md bg-white hover:shadow-xl hover:scale-105 transition-all overflow-hidden"
              onClick={() => handleTemplateClick(template.id)}
            >
              <img
                src={template.imageUrl || '/placeholder-image.png'}
                alt={template.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {template.name}
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTemplates;
