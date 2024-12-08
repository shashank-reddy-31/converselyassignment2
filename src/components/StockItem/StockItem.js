import React from 'react'
import './StockItem.css'

const StockItem = ({stock}) => {
  return (
    <tr>
      <td>{stock.symbol}</td>
      <td>${stock.price.toFixed(2)}</td>
      <td className={stock.change >= 0 ? 'positive' : 'negative'}>
        {stock.change.toFixed(2)}%
      </td>
    </tr>
  )
}

export default StockItem