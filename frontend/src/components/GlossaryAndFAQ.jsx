import React, { useState } from 'react';
import { BookOpen, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const glossaryTerms = [
  { term: 'Affidavit', definition: 'A written statement that you swear is true in front of a lawyer or court official. Think of it as a written promise on your life that what you wrote is the truth.' },
  { term: 'Bail', definition: 'A sum of money paid to the court so that an arrested person can go home while waiting for their trial. The money is returned after the case ends (if you show up to court).' },
  { term: 'Brief', definition: 'In Nigerian law, a "brief" is a legal document submitted to a court that summarizes the arguments in a case. When a client gives a lawyer a "brief", it simply means they have hired the lawyer to handle their case.' },
  { term: 'Caveat Emptor', definition: 'Latin for "buyer beware." It means: once you buy something, any problems with it are your responsibility. This is why you should always inspect goods before buying.' },
  { term: 'Defendant', definition: 'The person who is being accused or sued in a court case. If the police charge you with a crime, you become the defendant.' },
  { term: 'Easement', definition: 'A legal right to use someone else\'s land for a specific purpose. For example, the right to pass through your neighbor\'s compound to reach a road.' },
  { term: 'Ex-Parte', definition: 'A court order made by a judge without hearing from the other side. Usually an emergency order — e.g., to freeze someone\'s bank account before they run away with stolen money.' },
  { term: 'Fundamental Rights', definition: 'Basic rights guaranteed by the Nigerian Constitution (Chapter IV) that every citizen has — like the right to life, dignity, and a fair trial. These are very hard to take away legally.' },
  { term: 'Garnishee Order', definition: 'A court order that forces a third party (usually a bank) to pay a debt owed to you directly from the debtor\'s account. If someone owes you money and won\'t pay, you can get this.' },
  { term: 'Habeas Corpus', definition: 'Latin for "you have the body." It\'s a court order demanding that someone who is being held must be brought to court. Used when someone is detained illegally.' },
  { term: 'Injunction', definition: 'A court order that stops someone from doing something — or forces them to do something. E.g., a court can issue an injunction stopping a landlord from demolishing your house.' },
  { term: 'Intestate', definition: 'When someone dies without leaving a will. Nigerian law then decides how their property is shared, which may not match what they would have wanted.' },
  { term: 'Judgment', definition: 'The final decision of a court after hearing both sides of a case.' },
  { term: 'Jurisdiction', definition: 'The official authority a court has to hear and decide a particular type of case. Not every court can hear every case — a Magistrate Court cannot handle murder cases, for example.' },
  { term: 'Locus Standi', definition: 'Latin for "place to stand." Your legal right to bring a case to court. You must have a personal stake in the case — you can\'t sue on behalf of strangers for most matters.' },
  { term: 'Memorandum of Understanding (MOU)', definition: 'A document between two parties that records an agreement they intend to make. It\'s not as binding as a full contract, but it shows intent.' },
  { term: 'Nolle Prosequi', definition: 'A formal decision by a prosecutor to drop criminal charges against someone. The case is ended without a conviction.' },
  { term: 'Oath', definition: 'A formal promise — often in the name of God or on one\'s honor — that what you are saying is true. Breaking an oath in court is called perjury, which is a crime.' },
  { term: 'Plaintiff', definition: 'The person who starts a lawsuit — the one making the complaint. If your landlord refuses to pay back your deposit and you take them to court, you are the plaintiff.' },
  { term: 'Power of Attorney', definition: 'A legal document that gives someone else the right to make decisions on your behalf — for your property, finances, or health — when you cannot do so yourself.' },
  { term: 'Quit Notice', definition: 'An official notice a landlord gives a tenant to vacate (leave) a property. In Nigeria, the type and length of notice required depends on the tenancy agreement and the state.' },
  { term: 'Statute of Limitations', definition: 'A law that sets the maximum time you have to take legal action after a wrong has occurred. Wait too long and you may lose your right to sue.' },
  { term: 'Tort', definition: 'A civil wrong — not a crime — that causes harm to another person, giving that person the right to sue for compensation. Examples include negligence and defamation.' },
  { term: 'Undertaking', definition: 'A formal promise made to a court, often by a lawyer on behalf of their client. Breaking an undertaking to a court is a very serious matter.' },
  { term: 'Writ', definition: 'A formal written order from a court that commands someone to do — or stop doing — a specific thing.' }
];

const faqs = [
  { q: 'Can I represent myself in court in Nigeria?', a: 'Yes. This is called "appearing in person" or being a "litigant in person." You have the right to represent yourself in most courts. However, for complex cases, getting a lawyer is strongly advised.' },
  { q: 'What is the difference between a criminal case and a civil case?', a: 'In a criminal case, the government (through the police/prosecutors) takes someone to court for breaking the law (e.g., theft, assault). In a civil case, one private person sues another for a wrong done to them (e.g., unpaid debt, property damage).' },
  { q: 'How long does a court case take in Nigeria?', a: 'Nigerian courts are unfortunately known for delays. A simple case in a Magistrate Court can take 6-18 months. Complex High Court cases can drag on for years. Alternative Dispute Resolution (ADR) methods like mediation are much faster.' },
  { q: 'Can the police arrest me without a warrant?', a: 'Yes, in specific situations — if they see you committing a crime, or if they have reasonable grounds to believe you committed a serious offence. For minor matters, they generally need a warrant.' },
  { q: 'What should I do if a police officer demands a bribe?', a: 'Do not pay. Record the interaction if possible. Ask for their name and badge number. Report to the Police Professional Standards Department (X-Squad), the ICPC, or the Police Service Commission.' },
  { q: 'Is Nigerian Customary Law recognized in courts?', a: 'Yes. Nigeria operates three systems of law: English Common Law, Statutory Law (Acts of the National Assembly), and Customary Law. Customary law is often applied in family matters like marriage, inheritance, and land disputes, especially in rural areas.' }
];

export default function GlossaryAndFAQ() {
  const [activeTab, setActiveTab] = useState('glossary');
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const filteredTerms = glossaryTerms.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-brand-light min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-brand-navy mb-3">Legal Dictionary & FAQ</h1>
          <p className="text-gray-600 text-lg">
            Never be confused by a legal term again. Plain English explanations for every Nigerian.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white rounded-xl border border-gray-200 p-1 mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab('glossary')}
            className={`flex-1 flex items-center justify-center py-3 rounded-lg font-bold transition-all ${activeTab === 'glossary' ? 'bg-brand-navy text-white shadow' : 'text-gray-600 hover:text-brand-navy'}`}
          >
            <BookOpen className="w-5 h-5 mr-2" /> Legal Glossary
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 flex items-center justify-center py-3 rounded-lg font-bold transition-all ${activeTab === 'faq' ? 'bg-brand-navy text-white shadow' : 'text-gray-600 hover:text-brand-navy'}`}
          >
            <HelpCircle className="w-5 h-5 mr-2" /> Common Questions
          </button>
        </div>

        {/* Glossary Tab */}
        {activeTab === 'glossary' && (
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search legal terms..."
              className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none shadow-sm"
            />
            <div className="space-y-3">
              {filteredTerms.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:border-brand-yellow transition-all">
                  <div className="flex items-start space-x-3">
                    <span className="bg-brand-yellow text-brand-navy text-xs font-bold px-2 py-1 rounded mt-0.5 flex-shrink-0">
                      {item.term.charAt(0)}
                    </span>
                    <div>
                      <h3 className="font-bold text-brand-navy text-lg">{item.term}</h3>
                      <p className="text-gray-700 mt-1 leading-relaxed">{item.definition}</p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredTerms.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p>No terms found for "<span className="font-semibold">{searchTerm}</span>"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-3">
            {faqs.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-brand-navy pr-4">{item.q}</span>
                  {openFaq === idx
                    ? <ChevronUp className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed pt-4">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
