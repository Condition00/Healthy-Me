
import generatePreDiagnosisReport from "./pdf";
import { PreDiagnosisSummary } from "@/app/interfaces/report";

export async function GET(req: Request) {
    const params = new URLSearchParams(req.url.split("?")[1]);
    const data = params.get('data');
    if (!data) {
        return Response.json({ error: "No report data found." }, { status: 400 });
    }   
    const report =JSON.parse(data) as PreDiagnosisSummary;
    return new Response(await generatePreDiagnosisReport(report),)
}