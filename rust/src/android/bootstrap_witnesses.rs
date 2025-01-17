use super::primitive::ToPrimitiveObject;
use super::ptr_j::*;
use super::result::ToJniResult;
use crate::panic::{handle_exception_result, Zip};
use crate::ptr::RPtrRepresentable;
use cardano_serialization_lib::crypto::{BootstrapWitness, BootstrapWitnesses};
use jni::objects::JObject;
use jni::sys::jobject;
use jni::JNIEnv;

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_bootstrapWitnessesNew(
  env: JNIEnv, _: JObject,
) -> jobject {
  handle_exception_result(|| BootstrapWitnesses::new().rptr().jptr(&env)).jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_bootstrapWitnessesLen(
  env: JNIEnv, _: JObject, witnesses: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let witnesses = witnesses.rptr(&env)?;
    witnesses
      .typed_ref::<BootstrapWitnesses>()
      .map(|witnesses| witnesses.len())
      .and_then(|len| len.into_jlong().jobject(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_bootstrapWitnessesAdd(
  env: JNIEnv, _: JObject, witnesses: JRPtr, item: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let witnesses = witnesses.rptr(&env)?;
    let item = item.rptr(&env)?;
    witnesses
      .typed_ref::<BootstrapWitnesses>()
      .zip(item.typed_ref::<BootstrapWitness>())
      .map(|(witnesses, item)| witnesses.add(item))
  })
  .map(|_| JObject::null())
  .jresult(&env)
}
