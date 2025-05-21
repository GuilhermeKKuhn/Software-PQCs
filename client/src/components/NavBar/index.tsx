import {
  Box,
  Flex,
  Text,
  Spacer,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import logoUTFPR from "@/assets/logoUTFPR.png";

export const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <Box bg="white" px={6} py={4} boxShadow="md">
      <Flex align="center">
        {/* Logo UTFPR */}
        <Image src={logoUTFPR} alt="UTFPR" maxH="40px" />

        <Spacer />

        {/* Nome do usuário + menu */}
        <Menu>
          <MenuButton>
            <Flex align="center" gap={2}>
              <Avatar name={user.name} size="sm" />
              <Text fontWeight="medium">{user.name}</Text>
              <ChevronDownIcon />
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem>Perfil</MenuItem>
            <MenuItem onClick={() => {
              localStorage.clear();
              window.location.href = "/"; // ou use navigate()
            }}>Sair</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};
