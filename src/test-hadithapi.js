async function run() {
  const apiUrl = 'https://hadithapi.com/api/hadiths?apiKey=$2y$10$NNjpo1NFuYK1PInFLICucGH157hfEK3wDROSsVmYSfzRpO3ijNu&book=sahih-bukhari&paginate=5';
  const res = await fetch(apiUrl);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

run();
