import { useLocation, useNavigate } from "react-router-dom"
import { Alert, Button, Descriptions, Form, Input, InputNumber, Select, Tag, message } from "antd"

import { BackToDashboardButton } from "../components/BackToDashboardButton"
import { MAX_MERCHANT_NAME_LENGTH, MAX_SURCHARGE_PERCENT, MAX_TRANSACTION_AMOUNT } from "../config"
import { useDashboardPath } from "../hooks/useDashboardPath"
import { useCreateTransaction } from "../hooks/useTransactions"
import { CardBrand, TransactionStatus } from "../models/transaction"
import { ApiError } from "../services/api-client"
import { formatCurrency, formatPercent } from "../utils/format"
import { statusTagColor } from "../utils/status"

interface FormValues {
  merchantName: string
  cardBrand: CardBrand
  amount: number
  surchargePercent: number
  status: TransactionStatus
}

const FIELD_LABELS: Record<keyof FormValues, string> = {
  merchantName: "Merchant name",
  cardBrand: "Card brand",
  amount: "Amount",
  surchargePercent: "Surcharge rate",
  status: "Status",
}

const FORM_FIELD: Record<string, keyof FormValues> = {
  merchantName: "merchantName",
  cardBrand: "cardBrand",
  amount: "amount",
  surchargeRate: "surchargePercent",
  status: "status",
}

const percentToRate = (percent: number): number => Math.round(percent * 100) / 10000

/** Field errors are shown on the fields; anything else goes in the banner. */
const getBannerError = (error: Error | null): string | null => {
  if (!error) return null
  if (error instanceof ApiError && error.details?.length) {
    const unmapped = error.details.filter(({ field }) => !(field in FORM_FIELD))
    return unmapped.length ? unmapped.map(({ field, message }) => `${field} ${message}`).join("; ") : null
  }
  return error.message
}

const CARD_BRAND_OPTIONS = Object.values(CardBrand).map((brand) => ({ value: brand, label: brand }))

const STATUS_OPTIONS = Object.values(TransactionStatus).map((status) => ({
  value: status,
  label: <Tag color={statusTagColor(status)}>{status}</Tag>,
}))

const previewCharges = (amount: number, rate: number) => {
  const amountCents = Math.round(amount * 100)
  const surchargeCents = Math.round(amountCents * rate)
  return { surcharge: surchargeCents / 100, total: (amountCents + surchargeCents) / 100 }
}

export const NewTransactionPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dashboardPath = useDashboardPath()
  const [form] = Form.useForm<FormValues>()
  const { mutateAsync: createTransaction, submitting, error } = useCreateTransaction()
  const bannerError = getBannerError(error)

  const amount = Form.useWatch("amount", form)
  const surchargePercent = Form.useWatch("surchargePercent", form)
  const preview =
    typeof amount === "number" && amount > 0 && typeof surchargePercent === "number"
      ? { amount, surchargeRate: percentToRate(surchargePercent) }
      : null
  const charges = preview ? previewCharges(preview.amount, preview.surchargeRate) : null

  const handleFinish = async ({ surchargePercent, ...values }: FormValues) => {
    try {
      const transaction = await createTransaction({
        ...values,
        merchantName: values.merchantName.trim(),
        surchargeRate: percentToRate(surchargePercent),
      })
      message.success(`Transaction ${transaction.id} created`)
      navigate(`/transactions/${encodeURIComponent(transaction.id)}`, { state: location.state, replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.details) {
        form.setFields(
          err.details
            .filter(({ field }) => field in FORM_FIELD)
            .map(({ field, message }) => ({
              name: FORM_FIELD[field],
              errors: [`${FIELD_LABELS[FORM_FIELD[field]]} ${message}`],
            })),
        )
      }
    }
  }

  return (
    <>
      <div className="page-toolbar">
        <BackToDashboardButton />
      </div>
      <div className="panel new-transaction">
        <h2>New transaction</h2>

        {bannerError && (
          <Alert
            className="page-alert"
            type="error"
            showIcon
            message="Couldn't create transaction"
            description={bannerError}
          />
        )}

        <Form<FormValues> form={form} layout="vertical" onFinish={handleFinish} disabled={submitting}>
          <Form.Item
            name="merchantName"
            label={FIELD_LABELS.merchantName}
            extra={`Up to ${MAX_MERCHANT_NAME_LENGTH} characters`}
            rules={[{ required: true, whitespace: true, message: "Enter the merchant name" }]}
          >
            <Input placeholder="e.g. Blue Ridge Outfitters" autoComplete="off" maxLength={MAX_MERCHANT_NAME_LENGTH} />
          </Form.Item>

          <Form.Item
            name="cardBrand"
            label={FIELD_LABELS.cardBrand}
            rules={[{ required: true, message: "Select a card brand" }]}
          >
            <Select placeholder="Select a card brand" options={CARD_BRAND_OPTIONS} />
          </Form.Item>

          <Form.Item
            name="amount"
            label={FIELD_LABELS.amount}
            extra={`$0.01 to ${formatCurrency(MAX_TRANSACTION_AMOUNT)}`}
            rules={[{ required: true, message: "Enter an amount" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              prefix="$"
              precision={2}
              step={0.01}
              min={0.01}
              max={MAX_TRANSACTION_AMOUNT}
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item
            name="surchargePercent"
            label={FIELD_LABELS.surchargePercent}
            extra={`0% to ${MAX_SURCHARGE_PERCENT}%`}
            rules={[{ required: true, message: "Enter a surcharge rate" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              suffix="%"
              precision={2}
              step={0.1}
              min={0}
              max={MAX_SURCHARGE_PERCENT}
              placeholder="e.g. 3"
            />
          </Form.Item>

          <Form.Item name="status" label={FIELD_LABELS.status} rules={[{ required: true, message: "Select a status" }]}>
            <Select placeholder="Select a status" options={STATUS_OPTIONS} />
          </Form.Item>

          <Descriptions
            className="charge-preview"
            column={1}
            size="small"
            bordered
            items={[
              { key: "amount", label: "Amount", children: preview ? formatCurrency(preview.amount) : "—" },
              {
                key: "surcharge",
                label: preview ? `Surcharge (${formatPercent(preview.surchargeRate)})` : "Surcharge",
                children: charges ? formatCurrency(charges.surcharge) : "—",
              },
              { key: "total", label: "Total", children: charges ? <strong>{formatCurrency(charges.total)}</strong> : "—" },
            ]}
          />

          <div className="form-actions">
            <Button onClick={() => navigate(dashboardPath)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Create transaction
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}
