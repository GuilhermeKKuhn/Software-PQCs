import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Image,
  Text,
  Heading,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "@/service/AuthService";
import { IUserLogin } from "@/commons/interfaces";
import logoUTFPR from "@/assets/logoUTFPR.png";
import logoPQCS from "@/assets/logoPQCS.png"

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [apiError, setApiError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    setPending(true);
    setApiError(false);

    const userLogin: IUserLogin = { email: form.email, password: form.password };
    AuthService.login(userLogin)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/home");
      })
      .catch(() => {
        setApiError(true);
        setPending(false);
      });
  };

  return (
    <Flex
      height="100vh"
      bgGradient="linear(to-b, #fef2a1, #ffffff)"
      justify="center"
      align="center"
    >
      <Flex
        width="1400px"
        height="900px"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="lg"
      >
        {/* Lado esquerdo */}
        <Box
          width="50%"
          bg="#fdfde3"
          p={8}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          borderRightRadius="2xl"
        >
          <Flex justify="center" align="center" flex="1" direction="column" gap={6}>
            <Image src={logoPQCS} alt="Logo UTFPR" maxW="500px" />
          </Flex>

          <Box display="flex" justifyContent="flex-start">
           <Image src="/assets/logoUTFPR.png" alt="Logo UTFPR" maxW="120px" />
          </Box>
        </Box>

        {/* Lado direito */}
        <Box
          width="50%"
          bg="white"
          p={8}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Image
            src={logoUTFPR}
            alt="UTFPR logo"
            mx="auto"
            mb={4}
            maxW="120px"
          />

          <Heading size="sm" textAlign="center" color="#373435" mb={6}>
            Login
          </Heading>

          {apiError && (
            <Text color="red.500" textAlign="center" mb={4}>
              E-mail ou senha inválidos.
            </Text>
          )}

          <FormControl mb={4}>
            <Input
              name="email"
              placeholder="Informe seu login*"
              onChange={handleChange}
              value={form.email}
              borderRadius="full"
              bg="#f5f5f5"
              border="none"
              focusBorderColor="#373435"
            />
          </FormControl>

          <FormControl mb={6}>
            <InputGroup>
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Informe sua senha*"
                onChange={handleChange}
                value={form.password}
                borderRadius="full"
                bg="#f5f5f5"
                border="none"
                focusBorderColor="#373435"
              />
              <InputRightElement>
                <Button size="sm" variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁️"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Flex gap={4} mb={4}>
            <Button
              flex="1"
              borderRadius="full"
              bg="#FECB29"
              color="#373435"
              _hover={{ bg: "#ffd950" }}
              onClick={handleLogin}
              isLoading={pending}
            >
              Entrar
            </Button>
          </Flex>

          <Text fontSize="sm" textAlign="center" color="#999">
            <Link color="#373435">Esqueci o login/senha</Link> | <Link color="#373435">ajuda</Link>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
