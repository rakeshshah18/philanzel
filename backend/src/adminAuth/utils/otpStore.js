const otpMap = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
function saveOTP(email, otp) {
  otpMap.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });
}

function verifyOTP(email, otp) {
  const entry = otpMap.get(email);
  if (!entry) return false;
  if (entry.otp !== otp) return false;
  if (Date.now() > entry.expires) {
    otpMap.delete(email);
    return false;
  }
  otpMap.delete(email);
  return true;
}

export { generateOTP, saveOTP, verifyOTP };