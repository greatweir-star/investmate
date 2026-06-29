import { ReportClient } from "./ReportClient";

export default function ReportPage({ params }: { params: { id: string } }) {
  return <ReportClient reportId={params.id} />;
}

