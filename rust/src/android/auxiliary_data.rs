use super::ptr_j::*;
use super::result::ToJniResult;
use super::utils::{from_bytes, to_bytes};
use crate::panic::handle_exception_result;
use crate::ptr::RPtrRepresentable;
use crate::utils::ToFromBytes;
use cardano_serialization_lib::error::DeserializeError;
use cardano_serialization_lib::metadata::{AuxiliaryData, GeneralTransactionMetadata};
use cardano_serialization_lib::utils::BigNum;
use jni::objects::JObject;
use jni::sys::{jbyteArray, jobject};
use jni::JNIEnv;

pub type TransactionMetadatumLabel = BigNum;

impl ToFromBytes for AuxiliaryData {
  fn to_bytes(&self) -> Vec<u8> {
    self.to_bytes()
  }

  fn from_bytes(bytes: Vec<u8>) -> Result<AuxiliaryData, DeserializeError> {
    AuxiliaryData::from_bytes(bytes)
  }
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_auxiliaryDataToBytes(
  env: JNIEnv, _: JObject, auxiliary_data: JRPtr,
) -> jobject {
  to_bytes::<AuxiliaryData>(env, auxiliary_data)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_auxiliaryDataFromBytes(
  env: JNIEnv, _: JObject, bytes: jbyteArray,
) -> jobject {
  from_bytes::<AuxiliaryData>(env, bytes)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_auxiliaryDataNew(
  env: JNIEnv, _: JObject, metadata_ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let metadata = metadata_ptr.rptr(&env)?;
    metadata
      .typed_ref::<GeneralTransactionMetadata>()
      .map(|metadata| {
        let mut auxiliary_data = AuxiliaryData::new();
        auxiliary_data.set_metadata(&metadata);
        auxiliary_data
      })
      .and_then(|auxiliary_data| auxiliary_data.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_auxiliaryDataMetadata(
  env: JNIEnv, _: JObject, auxiliary_data_ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let auxiliary_data = auxiliary_data_ptr.rptr(&env)?;
    auxiliary_data
      .typed_ref::<AuxiliaryData>()
      .map(|auxiliary_data| auxiliary_data.metadata())
      .and_then(|metadata| metadata.rptr().jptr(&env))
  })
  .jresult(&env)
}
//
// #[allow(non_snake_case)]
// #[no_mangle]
// pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionMetadataLen(
//   env: JNIEnv, _: JObject, transaction_metadata: JRPtr
// ) -> jobject {
//   handle_exception_result(|| {
//     let transaction_metadata = transaction_metadata.rptr(&env)?;
//     transaction_metadata
//       .typed_ref::<TransactionMetadata>()
//       .map(|transaction_metadata| transaction_metadata.len())
//       .and_then(|len| len.into_jlong().jobject(&env))
//   })
//   .jresult(&env)
// }
//
// #[allow(non_snake_case)]
// #[no_mangle]
// pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionMetadataInsert(
//   env: JNIEnv, _: JObject, transaction_metadata: JRPtr, key: JRPtr, value: JRPtr
// ) -> jobject {
//   handle_exception_result(|| {
//     let transaction_metadata = transaction_metadata.rptr(&env)?;
//     let key = key.rptr(&env)?;
//     let value = value.rptr(&env)?;
//     transaction_metadata
//       .typed_ref::<TransactionMetadata>()
//       .zip(key.typed_ref::<TransactionMetadatumLabel>())
//       .zip(value.typed_ref::<TransactionMetadatum>())
//       .map(|((transaction_metadata, key), value)| transaction_metadata.insert(key, value))
//       .and_then(|transaction_metadatum| transaction_metadatum.rptr().jptr(&env))
//   })
//   .jresult(&env)
// }
//
// #[allow(non_snake_case)]
// #[no_mangle]
// pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionMetadataGet(
//   env: JNIEnv, _: JObject, transaction_metadata: JRPtr, key: JRPtr
// ) -> jobject {
//   handle_exception_result(|| {
//     let transaction_metadata = transaction_metadata.rptr(&env)?;
//     let key = key.rptr(&env)?;
//     transaction_metadata
//       .typed_ref::<TransactionMetadata>()
//       .zip(key.typed_ref::<TransactionMetadatumLabel>())
//       .and_then(|(transaction_metadata, key)| transaction_metadata.get(key).rptr().jptr(&env))
//   })
//   .jresult(&env)
// }
//
// #[allow(non_snake_case)]
// #[no_mangle]
// pub unsafe extern "C" fn Java_org_commonlands_mobile_Native_transactionMetadataKeys(
//   env: JNIEnv, _: JObject, transaction_metadata: JRPtr
// ) -> jobject {
//   handle_exception_result(|| {
//     let transaction_metadata = transaction_metadata.rptr(&env)?;
//     transaction_metadata
//       .typed_ref::<TransactionMetadata>()
//       .and_then(|transaction_metadata| transaction_metadata.keys().rptr().jptr(&env))
//   })
//   .jresult(&env)
// }
