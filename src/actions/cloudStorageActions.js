export const generateCloudStorageToken = () => {
  return {
    type: 'GENERATE_CLOUD_STORAGE_TOKEN'
  }
}

export const retrieveCloudStorageToken = () => {
  return {
    type: 'RETRIEVE_CLOUD_STORAGE_TOKEN'
  }
}
