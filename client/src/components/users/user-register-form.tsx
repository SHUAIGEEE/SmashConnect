"use client";
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
import { RegisterFormValue, RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormStatus } from "react-dom";
import { useToast } from "@/components/ui/use-toast";
import { signUp } from "@/actions/users/register";
import { useRouter } from "next/navigation";

export default function UserRegisterForm() {
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<RegisterFormValue>({
		resolver: zodResolver(RegisterSchema),
	});

	const { pending } = useFormStatus();

	const onSubmit = async (data: RegisterFormValue) => {
		const result = await signUp(data);
		console.log("Result: ", result);
		if (result?.error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: result.error,
			});
		} else {
			toast({
				title: "Success",
				description: "You have successfully registered, Login now!",
			});
			router.push(
				"/auth/login" +
					"?" +
					new URLSearchParams({
						email: result.user.email,
					}).toString()
			);
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
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="e.g. appealing_username"
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
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
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
						Sign Up
					</Button>
				</form>
			</Form>
		</>
	);
}
