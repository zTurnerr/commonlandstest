use super::ptr_j::*;
use super::result::ToJniResult;
use crate::panic::{handle_exception_result, ToResult, Zip};
use crate::ptr::RPtrRepresentable;
use cardano_serialization_lib::utils::BigNum;
use cardano_serialization_lib::UnitInterval;
use jni::objects::JObject;
use jni::sys::{jbyteArray, jobject};
use jni::JNIEnv;

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_unitIntervalToBytes(
  env: JNIEnv, _: JObject, unit_interval: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let unit_interval = unit_interval.rptr(&env)?;
    unit_interval
      .typed_ref::<UnitInterval>()
      .map(|unit_interval| unit_interval.to_bytes())
      .and_then(|bytes| env.byte_array_from_slice(&bytes).into_result())
      .map(|arr| JObject::from(arr))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_unitIntervalFromBytes(
  env: JNIEnv, _: JObject, bytes: jbyteArray,
) -> jobject {
  handle_exception_result(|| {
    env
      .convert_byte_array(bytes)
      .into_result()
      .and_then(|bytes| UnitInterval::from_bytes(bytes).into_result())
      .and_then(|unit_interval| unit_interval.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_unitIntervalNew(
  env: JNIEnv, _: JObject, numerator: JRPtr, denominator: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let numerator = numerator.rptr(&env)?;
    let denominator = denominator.rptr(&env)?;
    numerator.typed_ref::<BigNum>().zip(denominator.typed_ref::<BigNum>()).and_then(
      |(numerator, denominator)| UnitInterval::new(numerator, denominator).rptr().jptr(&env),
    )
  })
  .jresult(&env)
}
