"use client";
import { login } from "@/actions/login";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { LoginFormValue, LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";

export default function UserAuthForm() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl");
	const email = searchParams.get("email");

	const { toast } = useToast();

	const defaultValues = {
		email: email || "",
	};

	const form = useForm<LoginFormValue>({
		resolver: zodResolver(LoginSchema),
		defaultValues,
	});

	const { pending } = useFormStatus();

	const onSubmit = async (data: LoginFormValue) => {
		const result = await login(data, callbackUrl);
		if (result?.error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: result.error,
			});
		} else {
			toast({
				title: "Success",
				description: "You have successfully logged in",
			});
		}
	};

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full space-y-2"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="e.g. smashconnect@example.com"
										disabled={pending}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="*****"
										disabled={pending}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						disabled={pending}
						className="ml-auto w-full"
						type="submit"
					>
						Login
					</Button>
				</form>
			</Form>
		</>
	);
}
