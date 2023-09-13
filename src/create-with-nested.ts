import { z } from "zod";
import {
  createApi,
  readonly,
  GetInferredFromRaw,
} from "@thinknimble/tn-models";
import axios from "axios";
import { faker } from "@faker-js/faker";

export const createWithNested = async () => {
  //arrange
  const arrayElementShape = {
    id: z.string().uuid(),
    textElement: z.string(),
  };
  const baseModelShape = {
    id: z.string().uuid(),
    datetimeCreated: readonly(z.string().datetime().optional()),
    lastEdited: readonly(z.string().datetime().optional()),
  };
  const subEntityShape = {
    firstName: z.string(),
    lastName: z.string(),
  };
  const nestedObjectShape = {
    ...baseModelShape,
    ...subEntityShape,
  };
  const entityShape = {
    ...baseModelShape,
    nestedObject: z.object(nestedObjectShape),
  };
  const createShape = {
    nestedObject: z.object(subEntityShape),
    nestedArray: z.array(z.object(arrayElementShape)).optional().nullable(),
  };
  const testApi = createApi({
    client: axios,
    baseUri: "testing-create",
    models: {
      entity: entityShape,
      create: createShape,
    },
  });
  const testCreate = {
    nestedObject: {
      firstName: faker.person.fullName(),
      lastName: faker.person.lastName(),
    },
    nestedArray: [
      { id: faker.string.uuid(), textElement: faker.person.fullName() },
    ],
  };
  const expected = {
    data: {
      id: faker.string.uuid(),
      datetime_created: faker.date.anytime().toISOString(),
      last_edited: faker.date.anytime().toISOString(),
      nested_object: {
        id: faker.string.uuid(),
        datetime_created: faker.date.anytime().toISOString(),
        last_edited: faker.date.anytime().toISOString(),
        first_name: faker.person.fullName(),
        last_name: faker.person.lastName(),
      },
    },
  };
  const res = await testApi.create(testCreate);
};
