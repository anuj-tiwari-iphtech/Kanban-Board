import { useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import "./faq.css";

const faqData = [
  {
    question: "What is a restricted user?",
    answer: "A restricted user is a team member with limited access to the board. Restricted users can only view tasks assigned to them or to other restricted users — they cannot see the full board or tasks assigned to admins.",
  },
  {
    question: "Why can't I see all tasks on the board?",
    answer: "Restricted accounts are designed to keep your view focused on relevant work. If you believe you need broader access, please contact your admin to have your role updated.",
  },
  {
    question: "Why can't I add or delete columns?",
    answer: "Managing the board's structure (columns, workflow stages) is limited to admin accounts to keep the board consistent for the whole team. Contact your admin if a column needs to be added or changed.",
  },
  {
    question: "Can I create and edit tasks?",
    answer: "Yes. Restricted users can create new tasks and edit any task they are assigned to, including updating status, priority, due dates, comments, and attachments.",
  },
  {
    question: "Can I use Filter and Sort?",
    answer: "Filter and Sort are only available to admin accounts since they operate across all tasks on the board. Restricted users automatically see only their relevant tasks, so these tools aren't necessary.",
  },
  {
    question: "How do I get admin access?",
    answer: "Admin access is granted by whoever manages your workspace. Reach out to your team's admin or the person who invited you to request a role change.",
  },
  {
    question: "Can I comment and reply on tasks?",
    answer: "Yes, commenting and replying (including nested replies) are available to all users regardless of role.",
  },
  {
    question: "What happens if I try to access a restricted feature?",
    answer: "You'll see a message explaining that the feature isn't available for your role, along with a suggestion to contact your admin.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="faq-page">
      <h1 className="main-heading">Frequently Asked Questions</h1>
      <p className="faq-subtitle">
        Common questions about roles, permissions, and how to use the board.
      </p>

      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? "open" : ""}`}>
            <button className="faq-question" onClick={() => toggleFaq(index)}>
              <span>{item.question}</span>
              <HiChevronDown className={`faq-chevron ${openIndex === index ? "rotated" : ""}`} />
            </button>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}