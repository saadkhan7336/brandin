async function run() {
  try {
    const searchRes = await fetch("http://localhost:8000/api/v1/brands/debug-in?page=1&limit=12");
    console.log("Public Search Status:", searchRes.status);
    const json = await searchRes.json();
    console.log("Public Search Result:", JSON.stringify(json, null, 2));
  } catch(e) {
    console.error(e);
  }
}
run();
