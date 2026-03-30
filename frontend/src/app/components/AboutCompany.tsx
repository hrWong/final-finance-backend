export function AboutCompany() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">About the company</h3>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
        <div>
          <div className="text-sm text-gray-600 mb-1">Ticker</div>
          <div className="text-sm text-gray-900 flex items-center gap-2">
            AAPL
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Country</div>
          <div className="text-sm text-blue-600">United States of America</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">ISIN</div>
          <div className="text-sm text-gray-900 flex items-center gap-2">
            US0378331005
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Sector (GICS)</div>
          <div className="text-sm text-blue-600">Information Technology</div>
        </div>
      </div>

      <div className="text-sm text-gray-700 leading-relaxed">
        <p className="mb-4">
          Apple Inc. designs, manufactures, and markets smartphones; personal computers; tablets; wearables; and accessories worldwide. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple Vision Pro, Apple TV, Apple Watch, Beats products, and HomePod, as well as various Apple-branded and third-party iPhone and iPad accessories, and Mac and Apple Watch power adapters. It also provides AppleCare support and cloud services; and operates various platforms, including the App Store that allow customers to discover and download applications and digital content, such as books, music, video, games, and podcasts, as well as advertising services include third-party licensing arrangements and its own advertising platforms.
        </p>
        <p className="mb-4">
          In addition, the company offers various services, such as Apple Arcade, a game subscription service; Apple Fitness+, a personalized fitness service; Apple Music, which offers users a curated listening experience with on-demand radio stations; Apple News+, a subscription news and magazine service; Apple TV+, which offers exclusive original content; Apple Card, a co-branded credit card; and Apple Pay, a cashless payment service, as well as licenses its intellectual property. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets. It distributes third-party applications for its products through the App Store. The company also sells its products through its retail and online stores, and direct sales force; and third-party cellular network carriers, wholesalers, retailers, and resellers. Apple Inc. was founded in 1976 and is headquartered in Cupertino, California.
        </p>
      </div>
    </div>
  );
}
