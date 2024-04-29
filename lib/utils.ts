import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sendSmsFunc(column:string,data:any, setLoading:any, message:any,smsMessage:string) {
  try {
    const selectedData = data.map((item: { [x: string]: any; }) => item[column]);
    setLoading(true);
    selectedData.forEach(async (phoneNumber: string) => {
      //verifier que le numero commence par 06 ou 07 ou +336 ou +337
      if (!phoneNumber.match(/^(06|07|\+336|\+337)/)) {
        message.error("Le numéro de téléphone doit commencer par 06, 07, +336 ou +337");
      }
      if(phoneNumber.match(/^(06|07|\+336|\+337)/)){
        const response = await fetch("/api/sms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: smsMessage,
            tel: phoneNumber.match(/^(06|07)/) ? `+33${phoneNumber.slice(1)}` : phoneNumber,
          }),
        });
        if (response.ok) {
          message.success("SMS envoyé avec succès");
        } else {
          message.error("Erreur lors de l'envoi du SMS");
        }
      }
      
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS", error);
    message.error("Erreur lors de l'envoi du SMS");
  } finally {
    setLoading(false);
  };
}
