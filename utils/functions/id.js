export default async function id_generator() {
  const response = await fetch(
    "https://www.onlineappzone.com/api/snowflake-id?limit=1",
  );
  const ids = await response.json();
  return ids[0];
}
