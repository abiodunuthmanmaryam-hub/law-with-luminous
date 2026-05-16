import React from 'react';
import { Globe, ArrowRight, Info } from 'lucide-react';

export default function NewsSection() {
  const newsArticles = [
    {
      id: 1,
      headline: "U.S. Passport Rules Changing - What It Means for Nigerians",
      quickSummary: "The U.S. is making it harder for dual citizens to get passports. Many Nigerians have dual citizenship.",
      worldVersion: "The U.S. State Department announced new strict requirements for verifying dual citizenship status...",
      nigerianImpact: "If you have Nigerian + American citizenship, you might face delays or extra paperwork renewing your U.S. passport at the embassy.",
      example: "Chinedu holds both Nigerian and American passports. When he tries to renew his U.S. passport in Lagos, he now needs to provide his original Nigerian birth certificate.",
      category: "Immigration"
    },
    {
      id: 2,
      headline: "UK Bans Dependents for Care Workers",
      quickSummary: "The UK government has stopped health and care workers from bringing their families.",
      worldVersion: "The Home Office implemented a ban on dependents for those on Health and Care Worker visas to cut net migration.",
      nigerianImpact: "If you are a Nigerian nurse or care worker planning to relocate to the UK, your spouse and children can no longer come with you on your visa.",
      example: "Amina, a nurse in Abuja, got a job in London. Under the new law, her husband and two children must stay behind in Nigeria unless they get their own independent visas.",
      category: "World News"
    }
  ];

  const localUpdates = [
    {
      id: 1,
      title: "New Student Loan Act Signed",
      summary: "The President has signed a new law allowing students to get loans for university fees.",
      impact: "You can now apply for government loans if your family income meets certain criteria."
    },
    {
      id: 2,
      title: "Supreme Court Ruling on Land Grabbers (Omo Onile)",
      summary: "Court declares certain actions by land grabbers as federal criminal offenses.",
      impact: "If Omo Onile harass you on your land, you have stronger backing to involve the police without it being labeled just a 'civil matter'."
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Globe className="w-12 h-12 text-brand-navy" />
          </div>
          <h2 className="text-3xl font-bold text-brand-navy mb-4">What's Happening in the World?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            International and local legal news, broken down simply so you understand how it affects you as a Nigerian.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* World News Column (Takes up 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-brand-yellow pb-2 inline-block">Global Updates</h3>
            
            {newsArticles.map(article => (
              <div key={article.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold text-brand-navy">{article.headline}</h4>
                  <span className="bg-brand-navy text-white text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ml-4">
                    {article.category}
                  </span>
                </div>
                
                <p className="text-gray-800 font-medium mb-4">{article.quickSummary}</p>
                
                <div className="bg-white p-4 rounded-lg border border-brand-yellow/30 mb-4">
                  <h5 className="font-bold text-brand-yellow flex items-center mb-2">
                    <Info className="w-4 h-4 mr-2" /> How it affects Nigerians:
                  </h5>
                  <p className="text-gray-700 text-sm mb-3">{article.nigerianImpact}</p>
                  
                  <div className="bg-brand-light p-3 rounded border border-gray-100">
                    <span className="font-bold text-gray-800 text-sm">Example: </span>
                    <span className="text-gray-600 text-sm italic">"{article.example}"</span>
                  </div>
                </div>

                <button className="text-brand-navy font-bold text-sm flex items-center hover:text-brand-yellow transition">
                  Read full breakdown <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            ))}
          </div>

          {/* Local Updates Column (Takes up 1 column) */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-brand-yellow pb-2 inline-block">Nigerian Legal Updates</h3>
            
            <div className="bg-brand-navy rounded-xl p-6 text-white shadow-lg">
              <div className="space-y-6">
                {localUpdates.map(update => (
                  <div key={update.id} className="border-b border-white/20 pb-6 last:border-0 last:pb-0">
                    <h4 className="font-bold text-lg text-brand-yellow mb-2">{update.title}</h4>
                    <p className="text-gray-300 text-sm mb-3">{update.summary}</p>
                    <div className="bg-white/10 p-3 rounded-lg text-sm">
                      <span className="font-bold">Impact: </span>{update.impact}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 bg-brand-yellow text-brand-navy font-bold py-3 rounded-lg hover:bg-yellow-400 transition text-sm">
                View All Local Updates
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
