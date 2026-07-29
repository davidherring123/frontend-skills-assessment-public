import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Input, Select } from "antd"

import { CardBrand } from "../models/transaction"
import { createTransaction } from "../services/transaction-service"

export const NewTransactionPage = () => {
  const navigate = useNavigate()
  const [merchantName, setMerchantName] = useState("")
  const [cardBrand, setCardBrand] = useState<CardBrand>(CardBrand.VISA)
  const [amount, setAmount] = useState("")

  const handleSubmit = async () => {
    await createTransaction({
      merchantName,
      cardBrand,
      amount: parseInt(amount),
    })
    navigate("/")
  }

  return (
    <div className="new-transaction">
      <h2>New Transaction</h2>

      <div className="form-field">
        <Input
          placeholder="Merchant name"
          value={merchantName}
          onChange={(e) => setMerchantName(e.target.value)}
        />
      </div>

      <div className="form-field">
        <Select
          style={{ width: "100%" }}
          value={cardBrand}
          onChange={(value) => setCardBrand(value)}
          options={[
            { value: CardBrand.VISA, label: "VISA" },
            { value: CardBrand.MASTERCARD, label: "MASTERCARD" },
            { value: CardBrand.AMEX, label: "AMEX" },
            { value: CardBrand.DISCOVER, label: "DISCOVER" },
          ]}
        />
      </div>

      <div className="form-field">
        <Input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <Button type="primary" onClick={handleSubmit}>
        Create
      </Button>
    </div>
  )
}
