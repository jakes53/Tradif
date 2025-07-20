import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

const MarketNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://newsdata.io/api/1/news", {
          params: {
            apikey: "pub_d5f23d814b124b9bade9852685d5c91f", // Replace with your key
            category: "business,technology",
            q: "crypto",
            language: "en",
          },
        });

        const news = response.data.results || [];
        setArticles(news);
      } catch (err) {
        setError("Failed to fetch news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p className="text-white">Loading news...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-crypto-dark-blue">
      <Navbar />

      <section className="px-4 md:px-16 my-12">
        <h2 className="text-white text-3xl font-bold mb-6">Crypto News & Insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((item) => (
            <a
              key={item.link}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0b132b] rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-2">
                  {item.title.length > 100 ? item.title.slice(0, 100) + "..." : item.title}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  {new Date(item.pubDate).toDateString()}
                </p>
                <p className="text-gray-300 text-sm">
                  {item.description?.length > 150
                    ? item.description.slice(0, 150) + "..."
                    : item.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MarketNews;
