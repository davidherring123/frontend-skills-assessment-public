import { Result } from "antd"

import { BackToDashboardButton } from "../components/BackToDashboardButton"

export const NotFoundPage = () => (
  <Result
    status="404"
    title="Page not found"
    subTitle="The page you're looking for doesn't exist."
    extra={<BackToDashboardButton />}
  />
)
