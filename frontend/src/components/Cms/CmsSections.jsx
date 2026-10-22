import React from 'react';

/**
 * Renders CMS page sections when the backend has published content.
 * Falls back to the original static JSX otherwise.
 */
const CmsSections = ({ pageContent, fallback, titleClassName }) => {
  const sections = pageContent?.sections;
  if (!sections?.length) return fallback;

  return (
    <div className="space-y-10">
      {pageContent.pageTitle && (
        <h1 className={titleClassName || 'text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FF6534] text-center mb-8 tracking-tight'}>
          {pageContent.pageTitle}
        </h1>
      )}
      {sections.map((section) => (
        <section key={section._id || section.sectionKey} className="space-y-3">
          {section.title && (
            <h2 className="text-lg sm:text-xl font-bold text-[#FF6534]">{section.title}</h2>
          )}
          {section.subtitle && (
            <p className="text-sm font-semibold text-gray-600">{section.subtitle}</p>
          )}
          {section.body && (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section.body}</p>
          )}
          {section.bullets?.length > 0 && (
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
};

export default CmsSections;
