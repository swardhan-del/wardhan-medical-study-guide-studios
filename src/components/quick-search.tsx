import Form from "next/form";
export function QuickSearch() {
  return <Form action="/library" role="search" aria-label="Find a medical concept" className="quick-search">
    <label htmlFor="quick-concept">What do you want to understand?</label>
    <div><input id="quick-concept" name="q" type="search" maxLength={200} placeholder="Try axillary artery, GFR or antigen presentation" /><button className="button button-primary" type="submit">Search</button></div>
  </Form>;
}
