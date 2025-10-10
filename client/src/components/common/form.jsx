import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const CommonForm = ({ isLoading, error, type = "", handleSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <form
      onSubmit={onSubmit}
      action=""
      className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md space-y-6"
    >
      {type === "register" && (
        <div className="flex flex-col space-y-1">
          <Label htmlFor="name">Name:</Label>
          <Input
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            value={formData.name}
            type="text"
            id="name"
            name="name"
            required
          />
        </div>
      )}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="email">Email:</Label>
        <Input
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          value={formData.email}
          type="email"
          id="email"
          name="email"
          required
        />
      </div>
      <div className="flex flex-col space-y-1">
        <Label htmlFor="password">Password:</Label>
        <Input
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          value={formData.password}
          type="password"
          id="password"
          name="password"
          required
        />
      </div>
      <Button
        disabled={isLoading}
        type="submit"
        className="w-full font-semibold"
      >
        Submit
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export function FormInput({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );

        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
