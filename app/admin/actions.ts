"use server";

import { revalidatePath } from "next/cache";
import { isAdmin, login, logout } from "@/lib/auth";
import {
  setSubmissionStatus,
  setCorrectionStatus,
  updateSubmission,
  type SubmissionEdit,
} from "@/lib/storage";
import type { OfficeLevel, Party, OfficeStatus } from "@/data/cases";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = (formData.get("password") as string) ?? "";
  const ok = await login(password);
  if (!ok) return { error: "Incorrect password (or ADMIN_PASSWORD is not set)." };
  return {};
}

export async function logoutAction(): Promise<void> {
  await logout();
  revalidatePath("/admin");
}

/** Pull the reviewer-editable fields out of the submitted form. */
function editFromForm(formData: FormData): Partial<SubmissionEdit> {
  const patch: Partial<SubmissionEdit> = {};
  const str = (k: string) => (formData.get(k) as string | null)?.trim();

  const name = str("name");
  if (name) patch.name = name;
  const party = str("party");
  if (party) patch.party = party as Party;
  const officeLevel = str("officeLevel");
  if (officeLevel) patch.officeLevel = officeLevel as OfficeLevel;
  const officeTitle = str("officeTitle");
  if (officeTitle) patch.officeTitle = officeTitle;
  const state = str("state");
  if (state) patch.state = state.toUpperCase();
  const officeStatus = str("officeStatusAtOffense");
  if (officeStatus) patch.officeStatusAtOffense = officeStatus as OfficeStatus;
  const year = Number.parseInt(str("convictionYear") ?? "", 10);
  if (Number.isFinite(year)) patch.convictionYear = year;
  const offenseSummary = str("offenseSummary");
  if (offenseSummary) patch.offenseSummary = offenseSummary;

  return patch;
}

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Not authorized");
}

/** Save the reviewer's edits without changing status. */
export async function saveAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await updateSubmission(formData.get("id") as string, editFromForm(formData));
  revalidatePath("/admin");
}

/** Save any edits, then publish. */
export async function approveAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id") as string;
  await updateSubmission(id, editFromForm(formData));
  await setSubmissionStatus(id, "approved");
  // Approved submissions become published cases — refresh the public pages.
  revalidatePath("/");
  revalidatePath("/cases");
  revalidatePath("/admin");
}

export async function rejectAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await setSubmissionStatus(formData.get("id") as string, "rejected");
  revalidatePath("/admin");
}

export async function resolveCorrectionAction(formData: FormData): Promise<void> {
  if (!(await isAdmin())) throw new Error("Not authorized");
  await setCorrectionStatus(formData.get("id") as string, "resolved");
  revalidatePath("/admin");
}
