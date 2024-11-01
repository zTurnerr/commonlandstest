use super::primitive::ToPrimitiveObject;
use super::ptr_j::*;
use super::result::ToJniResult;
use crate::panic::handle_exception_result;
use crate::ptr::RPtrRepresentable;
use cardano_serialization_lib::TransactionInputs;
use jni::objects::JObject;
use jni::sys::{jlong, jobject};
use jni::JNIEnv;

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionInputsLen(
  env: JNIEnv, _: JObject, tx_inputs: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let tx_inputs = tx_inputs.rptr(&env)?;
    tx_inputs
      .typed_ref::<TransactionInputs>()
      .map(|tx_inputs| tx_inputs.len())
      .and_then(|len| len.into_jlong().jobject(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionInputsGet(
  env: JNIEnv, _: JObject, tx_inputs: JRPtr, index: jlong,
) -> jobject {
  handle_exception_result(|| {
    let tx_inputs = tx_inputs.rptr(&env)?;
    tx_inputs
      .typed_ref::<TransactionInputs>()
      .map(|tx_inputs| tx_inputs.get(usize::from_jlong(index)))
      .and_then(|tx_input| tx_input.rptr().jptr(&env))
  })
  .jresult(&env)
}
