import { generateInvestigationReport } from './app/actions/generate-report.js';

async function test() {
  console.log("Testing generation...");
  const result = await generateInvestigationReport(
    "inv-123",
    "Test claim",
    "/sample/earthquake-building.jpg"
  );
  console.log(result);
}

test();
