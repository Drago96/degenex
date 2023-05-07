import Input from "@/app/components/input";
import Paper from "@/app/components/paper";
import Typography from "@/app/components/typography";

export default function Login() {
  return (
    <div className="flex justify-center">
      <Paper>
        <form className="flex flex-col gap-7">
          <Typography className="text-center text-5xl" variant="h1">
            Log in
          </Typography>
          <Input name="email" type="email" label="Email" />
          <Input name="password" type="password" label="Password" />
          <Input
            name="confirm-password"
            type="password"
            label="Confirm Password"
          />
        </form>
      </Paper>
    </div>
  );
}
