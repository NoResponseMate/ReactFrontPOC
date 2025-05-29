import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react";
import Default from "~/layouts/Default";

interface ActionData {
    errors?: {
        newPassword?: string;
        confirmNewPassword?: string;
    };
    formError?: string;
    values?: {
        newPassword: string;
        confirmNewPassword: string;
    };
}

const API_URL = process.env.PUBLIC_API_URL;

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData();
    const token = form.get("token");
    const newPassword = form.get("newPassword");
    const confirmNewPassword = form.get("confirmNewPassword");

    if (typeof token !== "string" || !token) {
        return redirect("/forgotten-password");
    }

    const errors: ActionData["errors"] = {};
    if (typeof newPassword !== "string" || newPassword.length < 3) {
        errors.newPassword = "Password must be at least 3 characters.";
    }
    if (newPassword !== confirmNewPassword) {
        errors.confirmNewPassword = "Passwords must match.";
    }

    if (Object.keys(errors).length) {
        return json<ActionData>(
            { errors, values: { newPassword: newPassword as string, confirmNewPassword: confirmNewPassword as string } },
            { status: 400 }
        );
    }

    try {
        const response = await fetch(
            `${API_URL}/api/v2/shop/customers/reset-password/${token}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ newPassword, confirmNewPassword }),
            }
        );

        const text = await response.text();
        let data: any = {};
        try { data = text ? JSON.parse(text) : {}; } catch {}

        if (!response.ok) {
            const message = data.message || data.detail || "Password reset failed.";
            return json<ActionData>({ formError: message }, { status: 400 });
        }

        return redirect("/login?resetSuccessful=true");
    } catch (error) {
        console.error("Reset password error:", error);
        return json<ActionData>({ formError: "Unexpected error occurred." }, { status: 500 });
    }
};

export default function ResetPasswordPage() {
    const actionData = useActionData<ActionData>();
    const navigation = useNavigation();
    const [searchParams] = useSearchParams();
    const tokenValue = searchParams.get("token") ?? "";
    const busy = navigation.state !== "idle";

    return (
        <Default>
            <div className="container my-auto">
                <div className="row justify-content-center my-5">
                    <div className="col-12 col-md-8 col-lg-6">
                        <h1 className="h2 mb-4">Reset your password</h1>

                        {actionData?.formError && (
                            <div className="alert alert-danger">{actionData.formError}</div>
                        )}

                        <Form method="post" noValidate>
                            <input type="hidden" name="token" value={tokenValue} />

                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label required">
                                    New password
                                </label>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    className={`form-control${actionData?.errors?.newPassword ? " is-invalid" : ""}`}
                                    defaultValue={actionData?.values?.newPassword}
                                />
                                {actionData?.errors?.newPassword && (
                                    <div className="invalid-feedback">
                                        {actionData.errors.newPassword}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="confirmNewPassword" className="form-label required">
                                    Repeat new password
                                </label>
                                <input
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    type="password"
                                    className={`form-control${actionData?.errors?.confirmNewPassword ? " is-invalid" : ""}`}
                                    defaultValue={actionData?.values?.confirmNewPassword}
                                />
                                {actionData?.errors?.confirmNewPassword && (
                                    <div className="invalid-feedback">
                                        {actionData.errors.confirmNewPassword}
                                    </div>
                                )}
                            </div>

                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary" disabled={busy}>
                                    {busy ? "Resetting..." : "Reset Password"}
                                </button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </Default>
    );
}
