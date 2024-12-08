import React, {useEffect, useState} from 'react'
import StockItem from '../StockItem/StockItem'
import './StockList.css'

const StockList = () => {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStocks = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=1min&apikey=YOUR_API_KEY`,
      )

      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText)
      }

      const data = await response.json()
      if (!data['Time Series (1min)']) {
        throw new Error('Unexpected response format: ' + JSON.stringify(data))
      }

      const timeSeries = data['Time Series (1min)']
      const stocksArray = Object.entries(timeSeries).map(
        ([timestamp, values]) => ({
          symbol: 'AAPL',
          price: parseFloat(values['1. open']),
          change:
            ((parseFloat(values['4. close']) - parseFloat(values['1. open'])) /
              parseFloat(values['1. open'])) *
            100,
        }),
      )

      setStocks(stocksArray)
    } catch (err) {
      console.error('Fetch error: ', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStocks()
    const interval = setInterval(fetchStocks, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="loading">Loading stocks...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="stock-list">
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Change (%)</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <StockItem key={index} stock={stock} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StockList