import Button from "@/app/components/button";
import Input from "@/app/components/input";
import Paper from "@/app/components/paper";
import Typography from "@/app/components/typography";

export default function Register() {
  return (
    <div className="flex justify-center">
      <Paper>
        <form className="flex flex-col gap-7">
          <Typography className="text-center text-5xl" variant="h1">
            Register
          </Typography>
          <Input name="email" type="email" label="Email" />
          <Input name="password" type="password" label="Password" />
          <Input
            name="confirm-password"
            type="password"
            label="Confirm Password"
          />
          <Button type="submit">Register</Button>
        </form>
      </Paper>
    </div>
  );
}
