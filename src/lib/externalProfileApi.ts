export type ExternalProfile = {
  name?: string | null;
  user_email?: string | null;
  content_creator?: string | null;
  gsm?: string | null;
  firstname?: string | null;
  othername?: string | null;
  lastname?: string | null;
  address?: string | null;
  gender?: string | null;
  about?: string | null;
  passport?: string | null; // URL for avatar image
  status?: string | null;
};

export async function fetchExternalProfile(
  baseUrl: string,
  queryParam: string,
  queryValue: string
): Promise<ExternalProfile | null> {
  try {
    const url = `${baseUrl}?${encodeURIComponent(queryParam)}=${encodeURIComponent(queryValue)}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) return null;

    // Expect either an object or an array of objects
    const data = await res.json();
    const record = Array.isArray(data) ? data[0] : data;
    if (!record) return null;

    // Normalize name
    if (!record.name) {
      const parts = [record.firstname, record.othername, record.lastname].filter(Boolean);
      record.name = parts.length ? parts.join(" ") : null;
    }

    return record as ExternalProfile;
  } catch (e) {
    console.warn("External profile fetch failed:", e);
    return null;
  }
}
