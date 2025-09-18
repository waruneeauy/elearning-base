import prisma from "../config/prisma";
import { RequestCreateOrg } from "../interfaces/customer.interface";
import { NotFoundError } from "../errors/CustomError";

export const getAll = async () => {
  const data = await prisma.customer.findMany({});
  const items = await data.map((item) => ({
    ...item,
    logo: item.logo ? item.logo : "logo-default.png",
  }));
  return items;
};

export const createCustomer = async (data: RequestCreateOrg) => {
  const model = await data.body;

  const customerData = await prisma.customer.create({
    data: {
      logo: model.logo,
      name: model.name,
      isActive: model.isActive,
      createdBy: data.user.id,
      createdAt: new Date(),
    },
  });

  if (!customerData) {
    throw new NotFoundError(`Failed to create customer`);
  }

  return customerData.id;
};

export const updateCustomer = async (id: string, data: RequestCreateOrg) => {
  const model = await data.body;

  const customerData = await prisma.customer.update({
    where: {
      id,
    },
    data: {
      logo: model.logo,
      name: model.name,
      isActive: model.isActive,
      updatedBy: data.user.id,
      updatedAt: new Date(),
    },
  });

  if (!customerData) {
    throw new NotFoundError(`Failed to update customer with id ${id}`);
  }

  return customerData;
};

export const deleteCustomer = async (id: string) => {
  return await prisma.customer.delete({
    where: {
      id,
    },
  });
};
