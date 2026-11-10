import { Button } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

import { useDashboardPath } from "../hooks/useDashboardPath"

export const BackToDashboardButton = () => {
  const navigate = useNavigate()
  const dashboardPath = useDashboardPath()

  return (
    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(dashboardPath)}>
      Back to dashboard
    </Button>
  )
}
