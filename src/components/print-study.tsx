"use client";
export function PrintStudy({ label = "Print revision notes" }: { label?: string }) { return <button className="button button-primary print-control" onClick={() => window.print()}>{label}</button>; }
