import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: 'How does Wryte AI learn my company\'s voice and style?',
    answer: 'During onboarding, you provide your company information, mission statement, website URL, and preferred tone. Our AI analyzes this data along with your existing content to understand and replicate your unique brand voice, ensuring every blog sounds authentically yours.',
    value: 'item-1',
  },
  {
    question: 'Can I edit the AI-generated content before publishing?',
    answer:
      'Absolutely! Every step of the process allows for customization. You can edit blog titles, regenerate layouts, modify content directly, add sections, and make any adjustments needed. Wryte AI is designed to work with you, not replace you.',
    value: 'item-2',
  },
  {
    question: 'What CMS platforms does Wryte AI integrate with?',
    answer:
      'Wryte AI supports direct publishing to popular CMS platforms like WordPress, with more integrations coming soon. You can also export your blogs as Word documents or PDFs for manual publishing to any platform.',
    value: 'item-3',
  },
  {
    question: 'How does the SEO optimization work?',
    answer: 'Our AI automatically integrates your primary and secondary keywords throughout the content, generates optimized meta descriptions and tags, structures content with proper H1-H4 headings, and ensures readability scores meet SEO best practices. You can review and adjust all SEO elements before publishing.',
    value: 'item-4',
  },
  {
    question: 'Is my company data and content secure?',
    answer:
      'Yes, security is our top priority. All your data is encrypted both in transit and at rest. Your content is never used to train AI models, and we comply with GDPR and other data protection regulations. You maintain full ownership of all content generated.',
    value: 'item-5',
  },
  {
    question: 'Can multiple team members collaborate on blog creation?',
    answer:
      'Yes! Wryte AI includes collaboration features that allow team members to comment, suggest edits, and work together on blog layouts and content. This ensures alignment across your team before publication.',
    value: 'item-6',
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container py-20">
      <h2 className="mb-4 text-3xl font-bold md:text-4xl">
        Frequently Asked{' '}
        <span className="from-secondary/60 to-secondary bg-gradient-to-b bg-clip-text text-transparent">
          Questions
        </span>
      </h2>

      <Accordion type="single" collapsible className="AccordionRoot w-full">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">{question}</AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="mt-4 font-medium">
        Still have questions?{' '}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-primary border-primary transition-all hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
