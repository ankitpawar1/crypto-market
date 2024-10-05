import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("");

  // Fetch data using async/await
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets`,
        {
          params: {
            vs_currency: "usd",
            sparkline: false,
          },
        }
      );
      setCoins(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sorting function based on the current sort type
  const sortCoins = (coins, sortType) => {
    let sortedCoins = [...coins];
    if (sortType === "market_cap_desc") {
      sortedCoins.sort((a, b) => b.market_cap - a.market_cap);
    } else if (sortType === "price_change_percentage_24h_desc") {
      sortedCoins.sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      );
    }
    return sortedCoins;
  };

  // Apply sorting and filtering
  const sortedAndFilteredCoins = sortCoins(
    coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    ),
    sortType
  );

  // Sorting handler
  const handleSortByMarketCap = () => {
    setSortType("market_cap_desc");
  };

  const handleSortByPercentageChange = () => {
    setSortType("price_change_percentage_24h_desc");
  };

  return (
    <div className="container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or symbol"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSortByMarketCap}>Sort by Mkt Cap</button>
        <button onClick={handleSortByPercentageChange}>Sort by % Change</button>
      </div>
      <table>
        <tbody>
          {sortedAndFilteredCoins.map((coin) => (
            <tr key={coin.id}>
              <td>
                <img src={coin.image} alt={coin.name} />
              </td>
              <td>{coin.name}</td>
              <td>{coin.symbol.toUpperCase()}</td>
              <td>${coin.current_price}</td>
              <td>${coin.total_volume.toLocaleString()}</td>
              <td
                className={
                  coin.price_change_percentage_24h > 0 ? "positive" : "negative"
                }
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td>Mkt Cap: ${coin.market_cap.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
